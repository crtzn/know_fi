'use client';

import { LockKeyhole } from 'lucide-react';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export function CoursesCard() {
  return (
    <div className="flex flex-col gap-5">
      <Card className="cursor-pointer rounded-lg transition-all duration-300 hover:-translate-y-2 hover:translate-x-2 hover:shadow-[-10px_10px_0px_rgba(0,0,0,1)]">
        <CardHeader></CardHeader>
        <CardContent>
          <div className="flex flex-col gap-72">
            <div className="flex w-full text-4xl font-bold">
              <div className="">
                Course 1 <br /> By KnowFi
              </div>
              <div className="grow"></div>
              <div>
                <LockKeyhole width={90} height={90} />
              </div>
            </div>
            <Separator />
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm"></CardFooter>
      </Card>
      <div className="flex justify-center text-lg">100 tokens to unlock this course</div>
    </div>
  );
}
