'use client';

import React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const chartData = [
  { month: 'Juan', token: 186, aura: 80, quest: 90 },
  { month: 'Pedro', token: 305, aura: 200, quest: 90 },
  { month: 'Tanggol', token: 237, aura: 120, quest: 90 },
  { month: 'skibidi', token: 73, aura: 190, quest: 90 },
  { month: 'david', token: 209, aura: 130, quest: 90 },
  { month: 'david', token: 210, aura: 130, quest: 90 },
  { month: 'david', token: 211, aura: 130, quest: 90 },
  { month: 'david', token: 212, aura: 130, quest: 90 },
  { month: 'david', token: 212, aura: 130, quest: 90 },
  { month: 'david', token: 212, aura: 130, quest: 90 },
];

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-1)',
  },
  mobile: {
    label: 'Mobile',
    color: 'var(--chart-2)',
  },
  tablet: {
    label: 'Tablet',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig;

export function Analytics() {
  return (
    <div className="w-full">
      <div className="relative mt-5">
        {/* Border label */}
        <div className="absolute -top-4 left-5 z-10">
          <h1 className="bg-white px-2 text-xl font-bold tracking-wider">Analytics</h1>
        </div>

        <Card className="rounded-none">
          <CardHeader>
            <CardTitle></CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[10rem] w-[50rem]">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={true} />
                <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
                <Bar dataKey="token" fill="var(--color-desktop)" radius={4} />
                <Bar dataKey="aura" fill="var(--color-mobile)" radius={4} />
                <Bar dataKey="quest" fill="var(--color-tablet)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter>
            <p></p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
