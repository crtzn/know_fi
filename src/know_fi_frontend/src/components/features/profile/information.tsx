import { CircleDollarSign, MapPin } from 'lucide-react';
import { Pixelify_Sans } from 'next/font/google';
import React from 'react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export function Information() {
  return (
    <div className="w-12/12">
      <div className="relative mt-5">
        {/* Border label */}
        <div className="absolute -top-4 left-5 z-10">
          <h1 className="bg-white px-2 text-xl font-bold tracking-wider">Information</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-mono text-xl font-bold">Adrian Paul S. Orendain</CardTitle>
            <CardDescription>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-green-500 outline-black">Level</span>
                <span className="text-lg font-semibold text-green-500">XXX</span>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Progress bar placeholder */}
            <div className="mb-4">
              <div className="h-3 w-full rounded-sm border border-gray-300 bg-gray-100">
                <div className="h-full w-3/4 rounded-sm bg-green-400"></div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-10 w-10" />
                <span className="">Texas, USA</span>
              </div>
              <div className="flex items-center gap-2">
                <CircleDollarSign className="h-10 w-10" />
                <span className="">1,143 $KNF</span>
              </div>
            </div>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </div>
    </div>
  );
}
