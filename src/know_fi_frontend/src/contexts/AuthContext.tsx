'use client';

import { useRouter } from 'next/navigation';
import React, { createContext, ReactNode, useContext, useEffect } from 'react';

import { useAuthHook, type AuthState } from '../hooks/useAuth';
import { type Actors } from '../services';

interface AuthContextValue extends AuthState {
  // Basic Actions
  login: () => Promise<{ success: boolean; message?: string; error?: string }>;
  logout: () => Promise<{ success: boolean; message?: string; error?: string }>;
  refreshAuth: () => Promise<void>;

  // Utilities
  getActor: (name: keyof Actors) => any;
  getAuthService: () => any;
  getCanisterService: () => any;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const authHookValue = useAuthHook();
  const router = useRouter();

  useEffect(() => {
    const sessionTimeout = setTimeout(() => {
      authHookValue.logout().then(() => {
        router.push('/login');
      });
    }, 1800000); // 30 minutes in milliseconds

    return () => clearTimeout(sessionTimeout); // Cleanup on unmount
  }, [authHookValue, router]);

  return <AuthContext.Provider value={authHookValue}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export default AuthProvider;
