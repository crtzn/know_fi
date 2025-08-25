'use client';

import Link from 'next/link';

import { Card, CardContent } from '@/components/ui/card';

export function CourseCard() {
  return (
    <Card className="transition-all duration-200 hover:-translate-x-2 hover:-translate-y-2 hover:shadow-[8px_8px_0px_rgba(0,0,0,1)]">
      <CardContent className="flex size-full items-center justify-center p-4 text-4xl font-bold">
        <Link href={'/courses'} className="rounded-lg text-4xl font-bold hover:text-[#65009F]">
          <span className="text-[#65009F]">KNOW</span>COURSE
        </Link>
      </CardContent>
    </Card>
  );
}
