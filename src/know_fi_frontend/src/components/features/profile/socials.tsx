import { Github, Linkedin, Plus, X } from 'lucide-react';
import React from 'react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export function Socials() {
  return (
    <div className="w-12/12">
      <div className="relative mt-5">
        {/* Border label */}
        <div className="absolute -top-4 left-5 z-10">
          <h1 className="bg-white px-2 text-xl font-bold tracking-wider">Socials</h1>
        </div>

        <Card className="p-10">
          <div className="flex w-full gap-4">
            <div className="cursor-pointer rounded p-2 hover:bg-gray-100">
              <X className="h-10 w-10" />
            </div>
            <div className="cursor-pointer rounded p-2 hover:bg-gray-100">
              <Linkedin className="h-10 w-10" />
            </div>
            <div className="cursor-pointer rounded p-2 hover:bg-gray-100">
              <Github className="h-10 w-10" />
            </div>
            <div className="cursor-pointer rounded p-2 hover:bg-gray-100">
              <button>
                <Plus className="h-10 w-10 rounded-lg border-4 border-black" />
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
