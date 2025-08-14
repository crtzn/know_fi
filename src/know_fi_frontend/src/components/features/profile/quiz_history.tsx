import React from 'react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export function QuizHistory() {
  return (
    <div className="w-12/12">
      <div className="relative mt-5">
        {/* Border label */}
        <div className="absolute -top-4 left-5 z-10">
          <h1 className="bg-white px-2 text-xl font-bold tracking-wider">Quiz History</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle></CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>
            <p></p>
          </CardContent>
          <CardFooter>
            <p></p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
