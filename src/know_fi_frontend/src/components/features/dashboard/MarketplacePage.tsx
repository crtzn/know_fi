'use client';

import Link from 'next/link';

import { Card, CardContent } from '@/components/ui/card';

export function MarketplaceCard() {
  return (
    <Link href={'/marketplace'}>
      <Card className="size-full rounded-none transition-all duration-200 hover:-translate-x-2 hover:-translate-y-2 hover:shadow-[8px_8px_0px_rgba(0,0,0,1)]">
        <CardContent className="flex size-full items-center justify-center">
          <h1 className="text-4xl font-bold">Marketplace</h1>
        </CardContent>
      </Card>
    </Link>
  );
}
