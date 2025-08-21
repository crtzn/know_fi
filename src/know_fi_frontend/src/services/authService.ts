import { Identity } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';

import { canisterId as authCanisterId, createActor as createAuthActor } from '../../../declarations/auth';

// Type definitions
export interface UserSession {
  identity: Identity;
  principal: Principal;
  isAuthenticated: boolean;
  expiresAt?: Date;
}

export interface AuthConfig {
  identityProvider: string;
  host: string;
  maxTimeToLive?: bigint;
}

export type Role = 'owner' | 'admin';

export interface AuthResult {
  success: boolean;
  message?: string;
  error?: string;
  session?: UserSession;
}

class AuthService {
  private authClient: AuthClient | null = null;
  private authActor: any = null;
  private config: AuthConfig;
  private isInitialized = false;
  private initializePromise: Promise<void> | null = null;

  constructor() {
    const network = process.env.NEXT_PUBLIC_DFX_NETWORK || 'local';
    const isLocal = network !== 'ic';

    this.config = {
      identityProvider:
        network === 'ic'
          ? 'https://identity.ic0.app'
          : `http://${process.env.NEXT_PUBLIC_CANISTER_ID_INTERNET_IDENTITY}.localhost:4943/`,
      host: isLocal ? 'http://localhost:4943' : 'https://icp0.io',
      maxTimeToLive: BigInt(8) * BigInt(3600) * BigInt(1000) * BigInt(1000) * BigInt(1000), // 8 hours
    };
  }

  /**
   * Initialize AuthClient and setup actor (only once)
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // If already initializing, wait for that promise
    if (this.initializePromise) {
      return this.initializePromise;
    }

    this.initializePromise = this._initialize();
    return this.initializePromise;
  }

  private async _initialize(): Promise<void> {
    try {
      this.authClient = await AuthClient.create({
        idleOptions: {
          disableIdle: true,
          disableDefaultIdleCallback: true,
        },
      });

      await this.updateActor();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize AuthService:', error);
      this.initializePromise = null; // Reset so it can be retried
      throw new Error('Authentication initialization failed');
    }
  }

  /**
   * Update the auth actor with current identity
   */
  private async updateActor(): Promise<void> {
    if (!this.authClient) throw new Error('AuthClient not initialized');

    const identity = this.authClient.getIdentity();
    this.authActor = createAuthActor(authCanisterId, {
      agentOptions: {
        identity,
        host: this.config.host,
      },
    });
  }

  /**
   * Login with Internet Identity
   */
  async login(): Promise<AuthResult> {
    try {
      console.log('🔐 Starting login process...');
      await this.initialize();

      if (!this.authClient) {
        return { success: false, error: 'AuthClient not initialized' };
      }

      // Check if already authenticated
      const isAlreadyAuth = await this.authClient.isAuthenticated();
      if (isAlreadyAuth) {
        console.log('✅ Already authenticated, updating session...');
        await this.updateActor();
        const session = await this.getCurrentSession();
        return {
          success: true,
          message: 'Already authenticated',
          session,
        };
      }

      console.log('🚀 Initiating Internet Identity login...');
      return new Promise((resolve) => {
        this.authClient!.login({
          identityProvider: this.config.identityProvider,
          maxTimeToLive: this.config.maxTimeToLive,
          onSuccess: async () => {
            try {
              console.log('✅ Login successful, updating actor...');
              await this.updateActor();
              const session = await this.getCurrentSession();
              resolve({
                success: true,
                message: 'Login successful',
                session,
              });
            } catch (error) {
              console.error('❌ Failed to update session after login:', error);
              resolve({
                success: false,
                error: 'Failed to update session after login',
              });
            }
          },
          onError: (error) => {
            console.error('❌ Login failed:', error);
            resolve({
              success: false,
              error: `Login failed: ${error}`,
            });
          },
        });
      });
    } catch (error) {
      console.error('❌ Login initialization failed:', error);
      return {
        success: false,
        error: `Login initialization failed: ${error}`,
      };
    }
  }

  /**
   * Logout current user
   */
  async logout(): Promise<AuthResult> {
    try {
      if (!this.authClient) {
        return { success: false, error: 'Not authenticated' };
      }

      await this.authClient.logout();
      await this.updateActor();

      return {
        success: true,
        message: 'Logout successful',
      };
    } catch (error) {
      return {
        success: false,
        error: `Logout failed: ${error}`,
      };
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      await this.initialize();
      return this.authClient ? await this.authClient.isAuthenticated() : false;
    } catch (error) {
      console.error('Authentication check failed:', error);
      return false;
    }
  }

  /**
   * Get current user session
   */
  async getCurrentSession(): Promise<UserSession | null> {
    try {
      await this.initialize();

      if (!this.authClient || !(await this.authClient.isAuthenticated())) {
        return null;
      }

      const identity = this.authClient.getIdentity();
      const principal = identity.getPrincipal();

      return {
        identity,
        principal,
        isAuthenticated: true,
      };
    } catch (error) {
      console.error('Failed to get current session:', error);
      return null;
    }
  }

  /**
   * Get current user principal
   */
  async getCurrentPrincipal(): Promise<Principal | null> {
    const session = await this.getCurrentSession();
    return session?.principal || null;
  }

  /**
   * Initialize owner (should be called once by the first user)
   */
  async initializeOwner(): Promise<AuthResult> {
    try {
      if (!this.authActor) {
        await this.updateActor();
      }

      const result = await this.authActor.initializeOwner();

      if ('ok' in result) {
        return { success: true, message: result.ok };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to initialize owner: ${error}`,
      };
    }
  }

  /**
   * Assign role to user (owner/admin only)
   */
  async assignRole(userPrincipal: Principal, role: Role): Promise<AuthResult> {
    try {
      if (!this.authActor) {
        await this.updateActor();
      }

      const roleVariant = role === 'owner' ? { owner: null } : { admin: null };
      const result = await this.authActor.assignRole(userPrincipal, roleVariant);

      if ('ok' in result) {
        return { success: true, message: result.ok };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to assign role: ${error}`,
      };
    }
  }

  /**
   * Check if current user has specific role
   */
  async hasRole(role: Role): Promise<boolean> {
    try {
      if (!this.authActor) {
        await this.updateActor();
      }

      const principal = await this.getCurrentPrincipal();
      if (!principal) return false;

      const roleVariant = role === 'owner' ? { owner: null } : { admin: null };
      return await this.authActor.hasRole(principal, roleVariant);
    } catch (error) {
      console.error('Failed to check role:', error);
      return false;
    }
  }

  /**
   * Check if current user is owner
   */
  async isOwner(): Promise<boolean> {
    try {
      if (!this.authActor) {
        await this.updateActor();
      }

      const principal = await this.getCurrentPrincipal();
      if (!principal) return false;

      return await this.authActor.isOwner(principal);
    } catch (error) {
      console.error('Failed to check owner status:', error);
      return false;
    }
  }

  /**
   * Get current user's role
   */
  async getMyRole(): Promise<Role | null> {
    try {
      if (!this.authActor) {
        await this.updateActor();
      }

      const result = await this.authActor.myRole();

      if (result && result.length > 0) {
        const role = result[0];
        if ('owner' in role) return 'owner';
        if ('admin' in role) return 'admin';
      }

      return null;
    } catch (error) {
      console.error('Failed to get user role:', error);
      return null;
    }
  }

  /**
   * List all admins and owners (admin/owner only)
   */
  async listAdminsAndOwners(): Promise<Array<{ principal: Principal; role: Role }> | null> {
    try {
      if (!this.authActor) {
        await this.updateActor();
      }

      const result = await this.authActor.listAdminsAndOwners();

      if ('ok' in result) {
        return result.ok.map(([principal, roleVariant]: [Principal, any]) => ({
          principal,
          role: 'owner' in roleVariant ? 'owner' : 'admin',
        }));
      } else {
        console.error('Failed to list users:', result.err);
        return null;
      }
    } catch (error) {
      console.error('Failed to list admins and owners:', error);
      return null;
    }
  }

  /**
   * Get the auth actor instance
   */
  getAuthActor(): any {
    return this.authActor;
  }

  /**
   * Get auth client instance
   */
  getAuthClient(): AuthClient | null {
    return this.authClient;
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
