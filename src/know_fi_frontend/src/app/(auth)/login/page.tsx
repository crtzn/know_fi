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
      <div className="flex w-full items-center justify-center p-4 text-center sm:p-6 md:p-8 lg:p-10 xl:p-12">
        <h1 className="xs:text-xl flex flex-row items-center justify-center gap-2 text-center text-lg text-purple-900 sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
          <span className="leading-tight">Welcome to</span>
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <img
              src={knowFiLogo.src}
              alt="KnowFi Logo"
              className="xs:h-14 xs:w-14 h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 xl:h-24 xl:w-24"
            />
            <span className="font-bold leading-tight text-purple-950">KnowFi</span>
          </div>
        </h1>
      </div>

      <div className="mt-8 flex flex-col items-center px-4 sm:mt-12 lg:mt-20">
        <div className="w-full max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl">
          <div className="flex flex-row">
            <div className="flex flex-shrink-0 items-end justify-end">
              <img src={mascot.src} alt="Logo" className="h-16 w-16 sm:h-20 sm:w-20 lg:h-28 lg:w-28" />
            </div>
            <div className="relative ml-2 h-24 w-full sm:h-28 lg:h-32">
              {/* Smallest circle - bottom left */}
              <div className="absolute bottom-12 left-0 h-2 w-2 rounded-full border-2 border-purple-950 bg-white sm:bottom-16 sm:h-3 sm:w-3 sm:border-4 lg:bottom-[75px]"></div>

              {/* Medium circle */}
              <div className="sm:bottom-18 absolute bottom-14 left-1 h-3 w-3 rounded-full border-2 border-purple-950 bg-white sm:left-2 sm:h-4 sm:w-4 sm:border-4 lg:bottom-[90px] lg:h-5 lg:w-5"></div>

              {/* Large circle */}
              <div className="absolute bottom-16 left-2 h-5 w-5 rounded-full border-2 border-purple-950 bg-white sm:bottom-20 sm:left-3 sm:h-6 sm:w-6 sm:border-4 lg:bottom-28 lg:left-5 lg:h-8 lg:w-8"></div>

              {/* Main thought bubble - top right */}
              <div className="absolute bottom-3 left-6 flex h-full w-[85%] items-center rounded-2xl border-2 border-purple-950 bg-white p-3 sm:bottom-4 sm:left-8 sm:w-[88%] sm:rounded-3xl sm:border-4 sm:p-4 lg:bottom-20 lg:left-14 lg:w-[88%] lg:p-4">
                <TypingAnimation
                  className="text-xs font-bold leading-tight sm:text-sm lg:text-2xl"
                  duration={20}
                  text="Welcome to the future of learning! Join our growing community and start earning while you master blockchain."
                />
              </div>
            </div>
          </div>
        </div>

        <Card className="w-full max-w-sm border-2 border-purple-950 bg-white p-4 sm:max-w-lg sm:border-4 sm:p-6 lg:max-w-2xl lg:p-8 xl:max-w-xl">
          <CardHeader className="pb-4 sm:pb-6">
            <CardTitle className="text-center text-lg sm:text-xl">Continue with</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-3 sm:gap-4 lg:gap-5">
            <Button
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full border-2 border-purple-950 bg-white px-4 py-3 text-xs font-medium text-black hover:bg-purple-950 hover:text-white sm:h-14 sm:gap-3 sm:border-4 sm:py-4 sm:text-sm lg:h-16 lg:text-base"
              onClick={handleLogin}
            >
              <img
                src={internetComputer.src}
                alt="Internet Computer"
                className="h-6 w-6 flex-shrink-0 sm:h-8 sm:w-8 lg:h-12 lg:w-12"
              />
              <span>INTERNET COMPUTER</span>
            </Button>
            <Button
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full border-2 border-purple-950 bg-white px-4 py-3 text-xs font-medium text-black hover:bg-purple-950 hover:text-white sm:h-14 sm:gap-3 sm:border-4 sm:py-4 sm:text-sm lg:h-16 lg:text-base"
              onClick={handleLogin}
            >
              <img
                src={bitnifyWallet.src}
                alt="Bitnify Wallet"
                className="h-6 w-6 flex-shrink-0 sm:h-8 sm:w-8 lg:h-12 lg:w-12"
              />
              <span>BITNIFY WALLET</span>
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
