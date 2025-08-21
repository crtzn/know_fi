import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { leaderboardData, medalImages } from '../dummyData/leaderboardData';

export function LeaderBoardTable() {
  return (
    <div className="flex size-full w-[99.5%] overflow-auto rounded-lg border-2 border-black text-4xl font-bold shadow-[5px_5px_0_rgba(0,0,0,1)]">
      <Table className="rounded-2xl">
        <TableCaption></TableCaption>

        {/* Table Header */}
        <TableHeader className="bg-[#FFFFFF]">
          <TableRow>
            <TableCell colSpan={4} className="p-7 text-left text-5xl font-bold">
              Leaderboard (Top User All Time)
            </TableCell>
          </TableRow>
        </TableHeader>

        {/* Table Body */}
        <TableBody className="border-y-2 border-black">
          {leaderboardData.slice(0, 5).map((player) => (
            <TableRow key={player.rank} className="border-b-2 border-black bg-[#FFFFFF]">
              <TableCell className="w-[10%] items-center p-2 text-center text-xl font-bold">{player.rank}</TableCell>

              <TableCell className="flex w-4/5 items-center gap-3 p-2">
                <Image
                  unoptimized
                  src={player.avatar}
                  alt={player.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <span className="text-lg">{player.name}</span>
              </TableCell>

              <TableCell className="w-[10%] p-2 text-center">
                {player.rank <= 3 && (
                  <Image
                    unoptimized
                    src={medalImages[player.rank]}
                    alt={`Medal for rank ${player.rank}`}
                    width={36}
                    height={36}
                    className="mx-auto"
                  />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        {/* Table Footer */}
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4} className="bg-[#FFFFFF] text-center">
              <Link href="/leaderboard" className="text-lg underline underline-offset-2 hover:text-purple-500">
                View Full
              </Link>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
