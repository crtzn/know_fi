'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const Page = () => {
  const { login, logout, isAuthenticated, actors } = useAuth();
  const route = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    await login();

    /**
     * Add loading check here since there's a delay in receiving data from the ICP backend.
     * We need to wait for the actor and authentication state to be properly initialized
     * before proceeding, otherwise it will detect them as empty/null initially.
     */
    let retries = 20;
    while ((!actors || !isAuthenticated) && retries > 0) {
      await new Promise((res) => setTimeout(res, 150));
      retries--;
    }

    if (!actors || !isAuthenticated) {
      setLoading(false);
      return;
    }

    const categories = await actors.quiz.getCategories();

    if (Object.values(categories).length > 0) {
      route.push('/');
    } else {
      route.push('/categories');
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="login-section container flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-4xl">
          Welcome to <span className="font-bold">KnowFi</span>
        </h1>
        <div className="mt-10">
          <Button className="size-10 w-80 bg-blue-500 hover:bg-blue-600" onClick={handleLogin}>
            Login with Internet Identity
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
