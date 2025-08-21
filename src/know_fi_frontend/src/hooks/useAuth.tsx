import { Principal } from '@dfinity/principal';
import { useCallback, useEffect, useRef, useState } from 'react';

import { authService, canisterService, type Actors, type UserSession } from '../services';

export interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  session: UserSession | null;
  actors: Actors | null;
  userPrincipal: Principal | null;
}

export const useAuthHook = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    session: null,
    actors: null,
    userPrincipal: null,
  });

  // Track if we're already updating to prevent multiple concurrent calls
  const isUpdatingRef = useRef(false);
  const hasInitializedRef = useRef(false);

  const updateAuthState = useCallback(async (force: boolean = false) => {
    // Prevent multiple concurrent updates
    if (isUpdatingRef.current && !force) {
      console.log('Auth update already in progress, skipping...');
      return;
    }

    isUpdatingRef.current = true;

    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      // Check authentication status
      const isAuthenticated = await authService.isAuthenticated();

      if (!isAuthenticated) {
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          session: null,
          actors: null,
          userPrincipal: null,
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
        });
        return;
      }

      // Initialize actors with current identity
      const actors = await canisterService.initializeActors(session.identity);

      setAuthState({
        isLoading: false,
        isAuthenticated: true,
        session,
        actors,
        userPrincipal: session.principal,
      });
    } catch (error) {
      console.error('Failed to update auth state:', error);
      setAuthState({
        isLoading: false,
        isAuthenticated: false,
        session: null,
        actors: null,
        userPrincipal: null,
      });
    } finally {
      isUpdatingRef.current = false;
    }
  }, []);

  // Initialize on mount - only once
  useEffect(() => {
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      updateAuthState(true);
    }
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

  // Refresh auth state
  const refreshAuth = useCallback(async () => {
    await updateAuthState(true); // Force update
  }, [updateAuthState]);

  return {
    // State
    ...authState,

    // Actions
    login,
    logout,
    refreshAuth,

    // Utilities
    getActor: (name: keyof Actors) => authState.actors?.[name] || null,
    getAuthService: () => authService,
    getCanisterService: () => canisterService,
  };
};
