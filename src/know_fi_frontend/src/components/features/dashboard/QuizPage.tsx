'use client';

import { Info } from 'lucide-react';
import Image from 'next/image';
import { useEffect } from 'react';

import CategoriesModal from '@/components/features/quiz/categories-modal';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { UserProfile } from '@/hooks/userProfile';
import EnergyImg from '@/public/assets/enery-img.svg';

export function QuizCard() {
  const { energy, loading } = UserProfile();

  return (
    <div className="">
      <div className="flex justify-between">
        <h2 className="text-4xl font-bold">Take a Quiz</h2>
        <div className="align-center flex items-center justify-center gap-1">
          <Image src={EnergyImg} alt="Energy Image" width={32} height={32} />
          <p className="text-4xl font-bold">{loading ? 'Loading...' : energy?.toString()}</p>
        </div>
      </div>
      <div>
        <Card className="rounded-none">
          <CardHeader>
            <CardTitle className="flex w-full justify-between">
              Quiz Category:
              <Tooltip>
                <TooltipTrigger>
                  <Info width={28} height={28} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Info</p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
          </CardHeader>

          <CardFooter className="item-center align-center flex w-full justify-center text-4xl font-bold">
            <CategoriesModal />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
