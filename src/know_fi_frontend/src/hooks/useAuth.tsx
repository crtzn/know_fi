import { Principal } from '@dfinity/principal';
import { useCallback, useEffect, useState } from 'react';

import { authService, canisterService, type Actors, type Role, type UserSession } from '../services';

export interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  session: UserSession | null;
  actors: Actors | null;
  userPrincipal: Principal | null;
  userRole: Role | null;
  isOwner: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    session: null,
    actors: null,
    userPrincipal: null,
    userRole: null,
    isOwner: false,
  });

  const updateAuthState = useCallback(async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    try {
      // Check authentication status
      const isAuthenticated = await authService.isAuthenticated();

      if (!isAuthenticated) {
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          session: null,
          actors: null,
          userPrincipal: null,
          userRole: null,
          isOwner: false,
        });
        return;
      }

      // Get current session
      const session = await authService.getCurrentSession();

      if (!session) {
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          session: null,
          actors: null,
          userPrincipal: null,
          userRole: null,
          isOwner: false,
        });
        return;
      }

      // Initialize actors with current identity
      const actors = await canisterService.initializeActors(session.identity);

      // Get user role and owner status
      const userRole = await authService.getMyRole();
      const isOwner = await authService.isOwner();

      setAuthState({
        isLoading: false,
        isAuthenticated: true,
        session,
        actors,
        userPrincipal: session.principal,
        userRole,
        isOwner,
      });
    } catch (error) {
      console.error('Failed to update auth state:', error);
      setAuthState({
        isLoading: false,
        isAuthenticated: false,
        session: null,
        actors: null,
        userPrincipal: null,
        userRole: null,
        isOwner: false,
      });
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    updateAuthState();
  }, [updateAuthState]);

  const login = async (): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      const result = await authService.login();

      if (result.success) {
        await updateAuthState();
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: `Login failed: ${error}`,
      };
    }
  };

  const logout = async (): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      const result = await authService.logout();

      if (result.success) {
        canisterService.clearActors();
        await updateAuthState();
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: `Logout failed: ${error}`,
      };
    }
  };

  const initializeOwner = async (): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      const result = await authService.initializeOwner();

      if (result.success) {
        await updateAuthState(); // Refresh to get updated role
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: `Initialize owner failed: ${error}`,
      };
    }
  };

  const assignRole = async (
    userPrincipal: Principal,
    role: Role,
  ): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      const result = await authService.assignRole(userPrincipal, role);
      return result;
    } catch (error) {
      return {
        success: false,
        error: `Assign role failed: ${error}`,
      };
    }
  };

  const hasRole = async (role: Role): Promise<boolean> => {
    try {
      return await authService.hasRole(role);
    } catch (error) {
      console.error('Failed to check role:', error);
      return false;
    }
  };

  const listUsers = async (): Promise<Array<{ principal: Principal; role: Role }> | null> => {
    try {
      return await authService.listAdminsAndOwners();
    } catch (error) {
      console.error('Failed to list users:', error);
      return null;
    }
  };

  // Refresh auth state (useful after role changes)
  const refreshAuth = useCallback(async () => {
    await updateAuthState();
  }, [updateAuthState]);

  return {
    // State
    ...authState,

    // Actions
    login,
    logout,
    initializeOwner,
    assignRole,
    hasRole,
    listUsers,
    refreshAuth,

    // Utilities
    getActor: (name: keyof Actors) => authState.actors?.[name] || null,
    getAuthService: () => authService,
    getCanisterService: () => canisterService,
  };
};
