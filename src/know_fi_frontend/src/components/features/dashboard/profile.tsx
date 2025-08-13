'use client';

import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';

import sampleNft from '@/components/common/icons/sampleNft.png';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export function ProgressBar() {
  const [progress, setProgress] = React.useState(13);
  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);
  return <Progress value={progress} className="w-3/5" />;
}

export function ProfileCard() {
  return (
    <Link href={'/profile'}>
      <Card className="h-[25.5rem] rounded-none p-8 transition-all duration-200 hover:-translate-x-2 hover:-translate-y-2 hover:shadow-[8px_8px_0px_rgba(0,0,0,1)]">
        <CardContent className="flex size-full flex-col p-0">
          <div className="flex h-1/2 w-full items-center justify-center gap-7">
            <Image src={sampleNft} alt="Profile" unoptimized className="size-[90%] border-[3px] border-black" />
            <div className="flex size-full flex-col justify-end pb-8">
              <h1 className="text-3xl font-bold">John Doe</h1>
              <h1 className="text-xl font-bold text-green-500">Level 22</h1>
              <Progress value={66} className="rounded-sm border-2 border-black bg-gray-200 [&>div]:bg-green-500" />
            </div>
          </div>
          <div>badge</div>
        </CardContent>
      </Card>
    </Link>
  );
}
