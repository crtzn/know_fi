'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAuth } from '@/hooks/useAuth';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const route = useRouter();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      route.push('/login');
      console.log('Hello world');
    }
  }, [isAuthenticated, isLoading, route]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
};
