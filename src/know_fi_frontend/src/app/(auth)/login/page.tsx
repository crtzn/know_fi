'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import bitnifyWallet from '@/components/common/icons/bitnify-wallet.svg';
import internetComputer from '@/components/common/icons/internet-computer.svg';
import knowFiLogo from '@/components/common/icons/know_fi_logo.png';
import mascot from '@/components/common/icons/mascot.png';
import { TypingAnimation } from '@/components/features/dashboard/OwlTips';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

interface TypingAnimationProps {
  text: string;
  duration?: number;
  className?: string;
}

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

    const profile = await actors.profile.getProfile();
    if (!profile || Object.keys(profile).length === 0) {
      route.push('/set-profile');
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
    <div className="login-section overflow-hidden">
      <div className="flex w-full items-center justify-center p-10 text-center">
        <h1 className="flex items-center justify-center gap-2 text-center text-4xl text-purple-900">
          Welcome to
          <img src={knowFiLogo.src} alt="KnowFi Logo" width={115} height={115} />
          <span className="font-bold text-purple-950">KnowFi</span>
        </h1>
      </div>
      <div className="mt-20 flex flex-col items-center">
        <div className="w-11/12 md:w-7/12 lg:w-5/12">
          <div className="flex flex-row">
            <div className="flex items-end justify-end">
              <img src={mascot.src} alt="Logo" width={115} height={115} />
            </div>
            <div className="relative h-32 w-full">
              {/* Smallest circle - bottom left */}
              <div className="absolute bottom-[75px] left-0 size-3 rounded-full border-4 border-purple-950 bg-white"></div>

              {/* Medium circle */}
              <div className="absolute bottom-[90px] left-2 size-5 rounded-full border-4 border-purple-950 bg-white"></div>

              {/* Large circle */}
              <div className="absolute bottom-28 left-5 size-8 rounded-full border-4 border-purple-950 bg-white"></div>

              {/* Main thought bubble - top right */}
              <div className="absolute bottom-20 left-14 flex h-full w-[92%] items-center rounded-3xl border-4 border-purple-950 bg-white p-6">
                <TypingAnimation
                  className="text-2xl font-bold"
                  duration={20}
                  text="Welcome to the future of learning! Join our growing community and start earning while you master blockchain."
                />
              </div>
            </div>
          </div>
        </div>
        <Card className="container w-5/12 border-4 border-purple-950 bg-white p-8">
          <CardHeader>
            <CardTitle className="text-center">Continue with</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-5">
            <Button
              className="size-10 w-full rounded-full border-4 border-purple-950 bg-white p-8 text-black hover:bg-purple-950 hover:text-white"
              onClick={handleLogin}
            >
              <img src={internetComputer.src} alt="Internet Computer" width={50} height={50} /> INTERNET COMPUTER
            </Button>
            <Button
              className="size-10 w-full rounded-full border-4 border-purple-950 bg-white p-8 text-black hover:bg-purple-950 hover:text-white"
              onClick={handleLogin}
            >
              <img src={bitnifyWallet.src} alt="Bitnify Wallet" width={50} height={50} />
              BITNIFY WALLET
            </Button>
          </CardContent>
          <CardFooter>
            <p></p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Page;
