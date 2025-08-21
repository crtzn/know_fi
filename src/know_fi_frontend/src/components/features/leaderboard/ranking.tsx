'use client';

import Image from 'next/image';

import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

import { leaderboardData } from '../dummyData/leaderboardData';

export function RankingBoard() {
  return (
    <div className="flex size-full flex-col pb-20">
      <div className="flex flex-col items-center gap-2">
        <p className="text-4xl font-bold">Leaderboard</p>
        <p className="text-xl">Discover the top user ranked by aura points.</p>
      </div>

      <div className="flex grid-cols-3 items-end gap-10">
        <Table>
          <TableBody>
            {/* Table Header Row */}
            <TableRow className="hover:none flex text-lg font-bold hover:bg-transparent">
              <TableCell className="flex w-1/5 items-center justify-center text-xl">Place</TableCell>
              <TableCell className="flex w-4/5 items-center p-2 pl-5 text-xl">Username</TableCell>
              <TableCell className="flex w-1/5 items-center justify-center text-xl">Aura Points+</TableCell>
              <TableCell className="flex w-1/5 items-center justify-center text-xl">Badges</TableCell>
            </TableRow>

            {/* Data Rows */}
            {leaderboardData.slice(3).map((player) => (
              <TableRow key={player.rank} className="bg-[#FFFFFF]">
                <div className="flex size-full rounded-lg border-2 border-black">
                  <TableCell className="flex w-1/5 items-center justify-center text-center text-3xl font-bold">
                    #{player.rank}
                  </TableCell>
                  <TableCell className="flex w-4/5 items-center gap-3 p-2">
                    <Image
                      unoptimized
                      src={player.avatar}
                      alt={player.name}
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                    <div className="flex flex-col justify-center gap-0">
                      <span className="text-3xl font-bold">{player.name}</span>
                      <p>@{player.user}</p>
                    </div>
                  </TableCell>
                  <TableCell className="flex w-1/5 items-center justify-center text-3xl">{player.score}</TableCell>
                  <TableCell className="flex w-1/5 items-center justify-center text-3xl">{player.badges}</TableCell>
                </div>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
