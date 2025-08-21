'use client';

import Image from 'next/image';

import { Separator } from '@/components/ui/separator';
import aura_star from '@/public/assets/aura_star.svg';

import { leaderboardData } from '../dummyData/leaderboardData';

export function TopUser() {
  // top 3 players
  const first = leaderboardData.find((p) => p.rank === 1);
  const second = leaderboardData.find((p) => p.rank === 2);
  const third = leaderboardData.find((p) => p.rank === 3);

  return (
    <div className="flex w-full flex-col gap-20 pt-10">
      <div className="flex flex-col items-center gap-2">
        <p className="text-4xl font-bold">Top 3 Global Ranking</p>
        <p className="text-xl">Discover the top 3 user ranked by aura points.</p>
      </div>

      <div className="flex grid-cols-3 items-end gap-10">
        {/* left */}
        {second && (
          <div className="relative col-span-1 flex h-[242px] w-full flex-col items-center gap-2 rounded-lg border-4 border-[#A7A1A1] p-10">
            <Image
              unoptimized
              src={second.avatar}
              alt={second.name}
              width={90}
              height={90}
              className="absolute -top-12 left-1/2 -translate-x-1/2 rounded-full"
            />
            <p className="my-2 rounded-lg border-4 border-[#A7A1A1] px-24 text-4xl font-bold text-[#A7A1A1]">
              {second.rank}
            </p>
            <div className="flex size-full justify-between">
              <div className="flex flex-col justify-end">
                <p className="text-2xl font-bold">{second.name}</p>
                <p className="text-2xl font-bold text-gray-500">@{second.user}</p>
              </div>
              <div className="flex flex-col items-end justify-end">
                <p className="text-2xl font-bold">Badges: {second.badges}</p>
                <div className="flex justify-center gap-2">
                  <Image src={aura_star} alt="Aura:" width={16} unoptimized />
                  <p className="text-2xl font-bold text-[#939CFF]"> {second.score}</p>
                </div>
              </div>
            </div>
            <Separator className="border border-[#A7A1A1]" />
          </div>
        )}

        {/* middle */}
        {first && (
          <div className="relative col-span-1 flex h-[286px] w-full flex-col items-center gap-2 rounded-lg border-4 border-[#EAAC00] p-10">
            <Image
              unoptimized
              src={first.avatar}
              alt={first.name}
              width={90}
              height={90}
              className="absolute -top-12 left-1/2 -translate-x-1/2 rounded-full"
            />
            <div className="flex size-full items-center justify-center">
              <p className="my-2 rounded-lg border-4 border-[#EAAC00] px-24 text-5xl font-bold text-[#EAAC00]">
                {first.rank}
              </p>
            </div>
            <div className="flex size-full justify-between">
              <div className="flex flex-col justify-end">
                <p className="text-2xl font-bold">{first.name}</p>
                <p className="text-2xl font-bold text-gray-500">@{first.user}</p>
              </div>
              <div className="flex flex-col items-end justify-end">
                <p className="text-2xl font-bold">Badges: {first.badges}</p>
                <div className="flex justify-center gap-2">
                  <Image src={aura_star} alt="Aura:" width={16} unoptimized />
                  <p className="text-2xl font-bold text-[#939CFF]"> {first.score}</p>
                </div>
              </div>
            </div>
            <Separator className="border border-[#EAAC00]" />
          </div>
        )}

        {/* right */}
        {third && (
          <div className="relative col-span-1 flex h-[210px] w-full flex-col items-center rounded-lg border-4 border-[#AD5C00] p-10">
            <Image
              unoptimized
              src={third.avatar}
              alt={third.name}
              width={90}
              height={90}
              className="absolute -top-12 left-1/2 -translate-x-1/2 rounded-full"
            />
            <p className="my-2 rounded-lg border-4 border-[#AD5C00] px-24 text-3xl font-bold text-[#AD5C00]">
              {third.rank}
            </p>
            <div className="flex w-full justify-between">
              <div>
                <p className="text-2xl font-bold">{third.name}</p>
                <p className="text-2xl font-bold text-gray-500">@{third.user}</p>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-2xl font-bold">Badges: {third.badges}</p>
                <div className="flex justify-center gap-2">
                  <Image src={aura_star} alt="Aura:" width={16} unoptimized />
                  <p className="text-2xl font-bold text-[#939CFF]"> {third.score}</p>
                </div>
              </div>
            </div>
            <Separator className="border border-[#AD5C00]" />
          </div>
        )}
      </div>
    </div>
  );
}
