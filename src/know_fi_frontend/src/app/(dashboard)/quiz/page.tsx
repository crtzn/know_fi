import React from 'react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { quizData } from '@/providers/lib/quizData';

/**
 * Now the target here is, the question will depends of the users choices in categories
 * Then the question will be displayed randomize, then the level too.
 *
 */

export default function quiz() {
  return (
    <div className="container mx-auto">
      <Card className="h-80 rounded-none border-2 border-black bg-white shadow-[4px_4px_0_rgba(0,0,0,1)]">
        <CardHeader className="flex h-full justify-center text-center">
          <CardTitle className="text-[5rem]">Quiz</CardTitle>
        </CardHeader>
      </Card>

      {/* choices area here */}
    </div>
  );
}
