'use client';

import { Info } from 'lucide-react';
import Image from 'next/image';

import CategoriesModal from '@/components/features/quiz/categories-modal';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { UserProfile } from '@/hooks/userProfile';
import EnergyImg from '@/public/assets/enery-img.svg';

export function QuizCard() {
  const { currentEnergy, loading } = UserProfile();

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-4xl font-bold">Take a Quiz</h2>
      <div>
        <Card className="h-[31rem] max-h-full rounded-none">
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
