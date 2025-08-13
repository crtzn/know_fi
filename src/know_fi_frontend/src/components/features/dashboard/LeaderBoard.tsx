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

export function LeaderBoardTable() {
  // Dummy leaderboard data
  const leaderboardData = [
    { rank: 1, name: 'Juan', score: 980 },
    { rank: 2, name: 'Pedro', score: 940 },
    { rank: 3, name: 'tanggol', score: 910 },
    { rank: 4, name: 'skibidi', score: 890 },
    { rank: 5, name: 'david', score: 860 },
  ];

  return (
    <Table className="w-[99.5%] border-2 border-black shadow-[5px_5px_0_rgba(0,0,0,1)]">
      <TableCaption></TableCaption>
      <TableHeader className="bg-[#FFFFFF]">
        <TableRow>
          <TableCell colSpan={4} className="p-7 text-left text-5xl">
            Leaderboard (Top 5 This Season)
          </TableCell>
        </TableRow>
      </TableHeader>

      <TableBody className="border-2 border-black">
        {leaderboardData.map((player) => (
          <TableRow key={player.rank} className="border-2 border-black bg-[#FFFFFF]">
            <TableCell className="w-[10%] items-center p-2 text-center text-xl font-bold">{player.rank}</TableCell>
            <TableCell className="w-4/5 p-2">{player.name}</TableCell>
            <TableCell className="w-[10%] p-2 text-center">{player.score}</TableCell>
          </TableRow>
        ))}
      </TableBody>

      <TableFooter>
        <TableRow>
          <TableCell colSpan={4} className="bg-[#FFFFFF] text-center">
            <Link href="/leaderboard" className="underline underline-offset-2 hover:text-purple-500">
              View Full
            </Link>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
