'use client';

import { Loader } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import { useEffect } from 'react';

import sampleNft from '@/components/common/icons/sampleNft.png';
import { Card, CardContent } from '@/components/ui/card';
import useClient from '@/core/hooks/utils/useClient';
import { UserProfile } from '@/hooks/userProfile';
import aura_star from '@/public/assets/aura_star.svg';
import energy from '@/public/assets/energy.png';
import knf_token from '@/public/assets/knf_token.png';

export function ProfileCard() {
  const { isClient } = useClient();
  const { currentEnergy, loading, userToken, userProfile } = UserProfile();

  useEffect(() => {
    console.log('User Token Balances: ', userToken);
  }, []);

  return (
    <div>
      {isClient && (
        <Link href={'/profile'}>
          <Card className="h-[384px] rounded-none border-2 border-black p-8 transition-all duration-200 hover:-translate-x-2 hover:-translate-y-2 hover:shadow-[8px_8px_0px_rgba(0,0,0,1)]">
            <CardContent className="flex size-full flex-col p-0">
              <div className="flex h-1/2 w-full items-center justify-center gap-7">
                <Image
                  src={sampleNft}
                  width={150}
                  height={150}
                  alt="Profile"
                  unoptimized
                  className="border-[3px] border-black"
                />
                <div className="flex size-full flex-col justify-end pb-8">
                  <h1 className="text-4xl font-bold">{userProfile?.name}</h1>
                  <h1 className="text-2xl font-bold text-gray-800">Aura Points</h1>
                  <div className="flex items-center gap-3">
                    <Image src={aura_star} alt="Aura Star" width={22} unoptimized />
                    <h1 className="text-2xl font-bold text-[#939CFF]">900</h1>
                  </div>
                </div>
              </div>
              <div className="flex h-full justify-between gap-5">
                <div className="flex size-full flex-col justify-center">
                  <h1 className="text-3xl font-bold text-green-700">Easy 4</h1>
                  <h1 className="text-3xl font-bold text-blue-700">Medium 2</h1>
                  <h1 className="text-3xl font-bold text-red-700">Extreme 1</h1>
                </div>
                <div className="flex size-full flex-col justify-center gap-3">
                  <div className="flex items-center gap-3">
                    <Image src={knf_token} alt="Token" width={32} height={32} unoptimized />
                    <p className="text-2xl font-bold">{userToken} $KNF</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Image src={energy} alt="Energy Image" width={30} unoptimized />
                    <p className="text-2xl font-bold">{loading ? <Loader /> : currentEnergy?.toString()} Energy</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      )}
    </div>
  );
}
