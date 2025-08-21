'use client';

import { RankingBoard } from '@/components/features/leaderboard/ranking';
import { TopUser } from '@/components/features/leaderboard/topUser';
import { Separator } from '@/components/ui/separator';
import useClient from '@/core/hooks/utils/useClient';
import leaderboard from '@/public/assets/leaderboard.svg';

export default function Home() {
  const { isClient } = useClient();

  return (
    <main className="overflow-hidden font-sans">
      {isClient && (
        <div>
          {/* Top part */}
          <div
            className="flex w-full items-center justify-center"
            style={{
              backgroundImage: `url(${leaderboard.src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              minHeight: '200px',
              position: 'relative',
            }}
          >
            <h2 className="text-center text-3xl font-bold text-white">LEADERBOARD</h2>
          </div>

          {/* Graphs and charts section */}
          <div className="container flex flex-col gap-10">
            <TopUser />
            <Separator className="border border-[#A7A1A1]" />
            <RankingBoard />
          </div>
        </div>
      )}
    </main>
  );
}
