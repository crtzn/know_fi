'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const Page = () => {
  const { login, logout, isAuthenticated } = useAuth();
  const route = useRouter();

  const handleLogin = () => {
    login();
    route.push('/');
  };

  return (
    <div>
      <div className="login-section container flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-4xl">
          Welcome to <span className="font-bold">KnowFi</span>
        </h1>
        <div className="mt-10">
          {!isAuthenticated ? (
            <Button className="size-10 w-80 bg-blue-500 hover:bg-blue-600" onClick={handleLogin}>
              Login with Internet Identity
            </Button>
          ) : (
            <Button className="size-10 w-full bg-red-500 hover:bg-red-600" onClick={logout}>
              Logout to Internet Identity
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
