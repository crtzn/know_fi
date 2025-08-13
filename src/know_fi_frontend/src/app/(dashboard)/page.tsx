'use client';

import { Loader } from 'lucide-react';
import Image from 'next/image';
import { useEffect } from 'react';

import { AnalyticsGraph } from '@/components/features/dashboard/AnalyticsPage';
import { CourseCard } from '@/components/features/dashboard/CoursePage';
import { LeaderBoardTable } from '@/components/features/dashboard/LeaderBoard';
import { MarketplaceCard } from '@/components/features/dashboard/MarketplacePage';
import { MrOwlTips } from '@/components/features/dashboard/OwlTips';
import { ProfileCard } from '@/components/features/dashboard/profile';
import { QuizCard } from '@/components/features/dashboard/QuizPage';
import useClient from '@/core/hooks/utils/useClient';
import { UserProfile } from '@/hooks/userProfile';
import dashboard_bg from '@/public/assets/dashboard_bg.png';
import EnergyImg from '@/public/assets/enery-img.svg';
import CoinIcon from '@/public/assets/icon-coin.svg';

export default function Home() {
  const { isClient } = useClient();
  const { currentEnergy, loading, userToken } = UserProfile();

  useEffect(() => {
    console.log('User Token Balances: ', userToken);
  }, []);

  return (
    <main
      className="min-h-screen bg-cover bg-center px-[130px]"
      style={{ backgroundImage: `url(${dashboard_bg.src})` }}
    >
      {isClient && (
        <div className="grid size-full grid-cols-3 gap-10 pb-10">
          {/* left */}
          <div className="grid-rows col-span-2 mt-40 grid gap-10">
            <div className="flex flex-col">
              <MrOwlTips />
              <LeaderBoardTable />
            </div>

            <div className="grid gap-10">
              <div className="flex justify-between">
                <div>
                  <h1 className="font-pixel mb-5 text-5xl font-bold">Explore more</h1>
                </div>

                <div className="flex justify-between gap-5 align-middle">
                  <div className="flex items-center gap-1">
                    <Image src={EnergyImg} alt="Energy Image" width={30} />
                    <p className="text-2xl font-bold">{loading ? <Loader /> : currentEnergy?.toString()}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Image src={CoinIcon} alt="Token" width={32} height={32} />
                    <p className="text-2xl font-bold">{userToken}</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-10">
                <AnalyticsGraph />
                <MarketplaceCard />
              </div>
              <div className="grid grid-cols-2 gap-10">
                <QuizCard />
                <CourseCard />
              </div>
            </div>
          </div>

          {/* right */}
          <div className="col-span-1 mt-14 flex w-full flex-col gap-10">
            <ProfileCard />
            <ProfileCard />
            <ProfileCard />
          </div>
        </div>
      )}
    </main>
  );
}
