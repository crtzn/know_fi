'use client';

import { AnalyticsGraph } from '@/components/features/dashboard/AnalyticsPage';
import { CourseCard } from '@/components/features/dashboard/CoursePage';
import { MarketplaceCard } from '@/components/features/dashboard/MarketplacePage';
import { QuizCard } from '@/components/features/dashboard/QuizPage';
import { Separator } from '@/components/ui/separator';
import useClient from '@/core/hooks/utils/useClient';

export default function Home() {
  const { isClient } = useClient();

  return (
    <main className="font-sans">
      {isClient && (
        <div className="flex flex-col gap-10">
          {/* Top part */}
          <div className="mb-20 flex">
            <div className="flex flex-col">
              <h1 className="mb-5 text-5xl font-bold">Your Dashbaord</h1>
              <span>GET NFT rewards if na-reach yung</span>
              <span>rare badge na pwede mabenta sa marketplace</span>
            </div>
            <div className=""></div>
            <div>
              <span className="font-bold">12.3 points</span>
            </div>
          </div>

          {/* Graphs and charts section */}
          {/* LEFT */}
          <div className="flex gap-6">
            <div className="w-[50%]">
              <AnalyticsGraph />
            </div>
            <div className="w-[50%]">
              <MarketplaceCard />
            </div>
          </div>

          <div>
            <Separator />
          </div>

          {/* RIGHT */}
          <div className="flex gap-6">
            <div className="w-[50%]">
              <QuizCard />
            </div>
            <div className="w-[50%]">
              <CourseCard />
            </div>
          </div>

          <div className="mb-10">
            <Separator />
          </div>
        </div>
      )}
    </main>
  );
}
