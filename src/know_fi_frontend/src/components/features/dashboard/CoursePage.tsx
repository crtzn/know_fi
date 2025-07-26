'use client';

import { Info } from 'lucide-react';
import Link from 'next/link';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function CourseCard() {
  return (
    <div className="flex flex-col gap-5">
      <div className="text-4xl font-bold">Course</div>
      <div>
        <Card className="rounded-none transition-all duration-200 hover:-translate-y-2 hover:translate-x-2 hover:shadow-[-10px_10px_0px_rgba(0,0,0,1)]">
          <CardHeader></CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-72">
              <div className="flex w-full">
                <div className="flex flex-col">
                  <div className="text-4xl font-bold">Trading 101 by:</div>
                  <div className="text-4xl font-bold">Udemy</div>
                </div>
                <div className="grow"></div>
                <div>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info width={28} height={28} />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Info</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <Link href={'/courses'} className="rounded-lg text-4xl font-bold hover:text-[#65009F]">
                Redeem Course
              </Link>
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm"></CardFooter>
        </Card>
      </div>
    </div>
  );
}
