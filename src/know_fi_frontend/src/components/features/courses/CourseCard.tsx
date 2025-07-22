'use client';

import { Info, LockKeyhole, TrendingUp, Zap } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Separator } from '@/components/ui/separator';

export const description = 'A multiple bar chart';

const chartData = [
  { month: 'Juan', desktop: 186, mobile: 80, tablet: 90 },
  { month: 'Pedro', desktop: 305, mobile: 200, tablet: 90 },
  { month: 'Tanggol', desktop: 237, mobile: 120, tablet: 90 },
  { month: 'skibidi', desktop: 73, mobile: 190, tablet: 90 },
  { month: 'nigg', desktop: 209, mobile: 130, tablet: 90 },
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

export function CoursesCard() {
  return (
    <div className="flex flex-col gap-5">
      <Card>
        <CardHeader>
          {/* <CardTitle>Bar Chart - Multiple</CardTitle>
        <CardDescription>January - June 2024</CardDescription> */}
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-72">
            <div className="flex w-full">
              <div className="flex flex-col">
                <div className="text-4xl font-bold">Trading 101</div>
                <div className="text-4xl font-bold">By Udemy</div>
              </div>
              <div className="flex-grow"></div>
              <div>
                <LockKeyhole width={90} height={90} />
              </div>
            </div>
            <Separator />
          </div>
          {/* <ChartContainer config={chartConfig}>
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={true} />
                <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                <Bar dataKey="tablet" fill="var(--color-tablet)" radius={4} />
              </BarChart>
            </ChartContainer> */}
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          {/* <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">Showing total visitors for the last 6 months</div> */}
        </CardFooter>
      </Card>
      <div className="flex justify-center text-lg">100 tokens to unlock this course</div>
    </div>
  );
}
