'use client';

import * as React from 'react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function EventCard() {
  const events = [
    {
      month: 'AUG',
      day: '13',
      title: 'Resume Review Workshop',
      time: 'Wed Aug 13th @2:00 pm ET',
    },
    {
      month: 'AUG',
      day: '21',
      title: 'Tech Networking Night',
      time: 'Wed Aug 20th @6:00 pm ET',
    },
    {
      month: 'SEP',
      day: '05',
      title: 'Interview Prep Session',
      time: 'Fri Sep 5th @4:00 pm ET',
    },
  ];

  const colors = [
    'bg-yellow-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-red-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-orange-500',
  ];

  return (
    <Card className="h-[384px] rounded-none transition-all duration-200 hover:-translate-x-2 hover:-translate-y-2 hover:shadow-[8px_8px_0px_rgba(0,0,0,1)]">
      <CardHeader className="flex items-center justify-center text-4xl font-bold">UPCOMING EVENTS</CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {events.map((event, index) => {
            const color = colors[index % colors.length];
            return (
              <div key={index} className="flex items-center gap-3 pl-4">
                <div className={`flex size-20 flex-col items-center justify-center rounded-lg ${color}`}>
                  <p className="font-bold">{event.month}</p>
                  <p className="text-4xl font-bold">{event.day}</p>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="font-bold">{event.title}</p>
                  <p>{event.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
