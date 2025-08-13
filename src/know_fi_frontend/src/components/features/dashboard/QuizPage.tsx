'use client';

import { Info } from 'lucide-react';
import Image from 'next/image';

import CategoriesModal from '@/components/features/quiz/categories-modal';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { UserProfile } from '@/hooks/userProfile';
import EnergyImg from '@/public/assets/enery-img.svg';

export function QuizCard() {
  const { currentEnergy, loading } = UserProfile();

  return (
    <Card className="h-80 rounded-none transition-all duration-200 hover:-translate-x-2 hover:-translate-y-2 hover:shadow-[8px_8px_0px_rgba(0,0,0,1)]">
      <CardContent className="flex size-full items-center justify-center text-4xl font-bold">
        <CategoriesModal />
      </CardContent>
    </Card>
  );
}
