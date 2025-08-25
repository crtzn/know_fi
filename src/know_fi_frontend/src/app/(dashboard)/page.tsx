'use client';

import { Loader } from 'lucide-react';
import Image from 'next/image';
import { useEffect } from 'react';

import { AnalyticsGraph } from '@/components/features/dashboard/AnalyticsPage';
import { CourseCard } from '@/components/features/dashboard/CoursePage';
import { EventCard } from '@/components/features/dashboard/Events';
import { LeaderBoardTable } from '@/components/features/dashboard/LeaderBoard';
import { MarketplaceCard } from '@/components/features/dashboard/MarketplacePage';
import { NotificationCard } from '@/components/features/dashboard/notification';
import { MrOwlTips } from '@/components/features/dashboard/OwlTips';
import { ProfileCard } from '@/components/features/dashboard/profile';
import { QuestCard } from '@/components/features/dashboard/QuestCard';
import { QuizCard } from '@/components/features/dashboard/QuizPage';
import { DialogDemo } from '@/components/features/dashboard/welcomeDialog';
import { Separator } from '@/components/ui/separator';
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
    <main className="overflow-hidden font-sans">
      {isClient && (
        <div className="container grid size-full grid-cols-3 gap-10">
          {/* left */}
          <div className="col-span-2 mt-40 grid grid-rows-2 gap-10">
            <div className="flex flex-col">
              <MrOwlTips />
              <LeaderBoardTable />
            </div>
            <div className="flex flex-col gap-10">
              <Separator className="border border-black" />
              <h1 className="font-pixel text-5xl font-bold">Explore more</h1>
              <div className="grid-rows grid">
                <AnalyticsGraph />
                <QuizCard />
                <CourseCard />
                <QuestCard />
              </div>
            </div>
          </div>

          {/* right */}
          <div className="col-span-1 mt-14 flex w-full flex-col gap-8">
            <ProfileCard />
            <EventCard />
            <NotificationCard />
          </div>
          {/* <DialogDemo /> */}
        </div>
      )}
    </main>
  );
}
