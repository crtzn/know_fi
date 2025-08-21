import { Github, Linkedin, Plus, X } from 'lucide-react';
import React from 'react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UserProfile } from '@/hooks/userProfile';

export function Socials() {
  const { userProfile } = UserProfile();
  return (
    <div className="w-12/12">
      <div className="relative mt-5">
        {/* Border label */}
        <div className="absolute -top-4 left-5 z-10">
          <h1 className="bg-white px-2 text-xl font-bold tracking-wider">Socials</h1>
        </div>

        <Card className="rounded-none p-10">
          <div className="flex w-full gap-4">
            <div className="cursor-pointer rounded p-2 hover:bg-gray-100">
              <a href={userProfile?.twitter} target="_blank">
                <X className="size-10" />
              </a>
            </div>
            <div className="cursor-pointer rounded p-2 hover:bg-gray-100">
              <a href={userProfile?.linkedin} target="_blank">
                <Linkedin className="size-10" />
              </a>
            </div>
            <div className="cursor-pointer rounded p-2 hover:bg-gray-100">
              <a href={userProfile?.github} target="_blank">
                <Github className="size-10" />
              </a>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
