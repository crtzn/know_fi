'use client';

import Image from 'next/image';
import Link from 'next/link';

import sampleNft from '@/components/common/icons/sampleNft.png';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export const description = 'A multiple bar chart';

export function MarketplaceCard() {
  return (
    <div className="flex flex-col gap-5">
      <div className="text-4xl font-bold">Marketplace</div>
      <Link href={'/marketplace'}>
        <Card className="rounded-none">
          <CardHeader>
            <CardTitle className="text-4xl font-bold">Featured NFTs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-5">
              <div className="flex h-64 w-full">
                <div className="flex w-5/12 items-center justify-center">
                  <Image src={sampleNft} alt="Logo" width={230} height={36} unoptimized />
                </div>
                <div className="flex w-7/12 items-start justify-start pb-2 text-3xl">
                  NFT name: Sample NFT
                  <br />
                  Rarity: LEGENDARY
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <div className="mb-2 text-4xl font-bold">buy and sell now</div>
          </CardFooter>
        </Card>
      </Link>
    </div>
  );
}
