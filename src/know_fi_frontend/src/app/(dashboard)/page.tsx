'use client';

import { Loader } from 'lucide-react';
import Image from 'next/image';
import { useEffect } from 'react';

import { AnalyticsGraph } from '@/components/features/dashboard/AnalyticsPage';
import { CourseCard } from '@/components/features/dashboard/CoursePage';
import { MarketplaceCard } from '@/components/features/dashboard/MarketplacePage';
import { QuizCard } from '@/components/features/dashboard/QuizPage';
import useClient from '@/core/hooks/utils/useClient';
import { UserProfile } from '@/hooks/userProfile';
import EnergyImg from '@/public/assets/enery-img.svg';
import CoinIcon from '@/public/assets/icon-coin.svg';

export default function Home() {
  const { isClient } = useClient();
  const { currentEnergy, loading, userToken } = UserProfile();

  useEffect(() => {
    console.log('User Token Balances: ', userToken);
  }, []);

  return (
    <main>
      {isClient && (
        <div>
          {/* Top part */}

          <div className="flex justify-between">
            <div>
              <h1 className="mb-5 text-5xl font-bold">Dashboard</h1>
              <p>
                GET NFT rewards if na-reach yung <br /> rare badge na pwede mabenta sa marketplace
              </p>
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

          {/* Graphs and charts section */}
          {/* LEFT */}

          <div className="mt-10 grid grid-cols-2 gap-10">
            <AnalyticsGraph />
            <MarketplaceCard />
          </div>

          <div className="mt-10 grid grid-cols-2 gap-6">
            <QuizCard />
            <CourseCard />
          </div>
        </div>
      )}
    </main>
  );
}
