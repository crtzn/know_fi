'use client';

import { Bell } from 'lucide-react';
import * as React from 'react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function NotificationCard() {
  return (
    <Card className="h-[384px] rounded-none transition-all duration-200 hover:-translate-x-2 hover:-translate-y-2 hover:shadow-[8px_8px_0px_rgba(0,0,0,1)]">
      <CardHeader className="flex flex-row items-center justify-center gap-2 text-4xl font-bold">
        <Bell width={32} height={32} />
        NOTIFICATIONS
      </CardHeader>
      <CardContent className="flex size-full flex-col p-0">
        <div className="flex h-1/2 w-full items-center justify-center gap-7"></div>
      </CardContent>
    </Card>
  );
}
