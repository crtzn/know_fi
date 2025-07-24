'use client';

import Link from 'next/link';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

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

export function AnalyticsGraph() {
  return (
    <div className="flex flex-col gap-5">
      <div className="text-4xl font-bold">Analytics</div>
      <Link href={'/analytics'}>
        <Card>
          <CardHeader></CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={true} />
                <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                <Bar dataKey="tablet" fill="var(--color-tablet)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm"></CardFooter>
        </Card>
      </Link>
    </div>
  );
}
