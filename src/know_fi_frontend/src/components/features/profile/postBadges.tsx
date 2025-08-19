import React from 'react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const dummyData = [{ id: 1, post: 0, badges: 0 }];

export function PostBadges() {
  return (
    <div>
      {dummyData.map((item) => (
        <div key={item.id} className="flex gap-10">
          <h1 className="text-lg font-bold">Post {item.post}</h1>
          <h1 className="text-lg font-bold">Badges {item.badges}</h1>
        </div>
      ))}
      <Card className="mt-4 rounded-none">
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
  );
}
