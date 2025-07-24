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
    <main>
      {isClient && (
        <div className="flex flex-col gap-10">
          {/* Top part */}
          <div className="mb-10 flex">
            <div className="flex flex-col">
              <h1 className="mb-5 text-5xl font-bold">Your Dashbaord</h1>
              <span>
                GET NFT rewards if na-reach yung <br /> rare badge na pwede mabenta sa marketplace
              </span>
            </div>
            <div className="grow"></div>
            <div>
              <span className="text-xl font-bold">12.3 points</span>
            </div>
            {/* <div className="flex items-start">
              <span className="flex items-start rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-xl font-bold text-white">
                Available points: 12.3
              </span>
            </div> */}
          </div>

          {/* Graphs and charts section */}
          {/* LEFT */}
          <div className="grid grid-cols-2 gap-10">
            <AnalyticsGraph />
            <MarketplaceCard />
          </div>

          <div>
            <Separator />
          </div>

          {/* RIGHT */}
          <div className="grid grid-cols-2 gap-6">
            <QuizCard />
            <CourseCard />
          </div>
        </div>
      )}
    </main>
  );
}
