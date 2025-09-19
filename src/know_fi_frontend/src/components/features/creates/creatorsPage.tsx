'use client';

import { useState } from 'react';

import { KnowCreatesContribute } from '@/components/features/creates/knowCreatesContribute';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

type Course = {
  id: number;
  title: string;
  description: string;
  rating: number;
  tokens: number;
  status: 'active' | 'review';
};

export function CreatorsPage() {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: 1,
      title: 'MOTOKO 101',
      description: 'Learn Motoko for Smart Contracting. A stepping stone for Decentralized Finance solutions.',
      rating: 4.5,
      tokens: 120,
      status: 'active',
    },
    {
      id: 2,
      title: 'MOTOKO 101',
      description: 'Learn Motoko for Smart Contracting. A stepping stone for Decentralized Finance solutions.',
      rating: 4.5,
      tokens: 120,
      status: 'review',
    },
    {
      id: 3,
      title: 'MOTOKO 101',
      description: 'Learn Motoko for Smart Contracting. A stepping stone for Decentralized Finance solutions.',
      rating: 4.5,
      tokens: 120,
      status: 'review',
    },
  ]);

  const [open, setOpen] = useState(false);

  const activeCourses = courses.filter((c) => c.status === 'active');
  const reviewCourses = courses.filter((c) => c.status === 'review');

  return (
    <div className="space-y-6 p-8">
      <h1 className="text-2xl font-bold">Creators Page</h1>

      {/* Active Course Section */}
      <div>
        <h2 className="text-lg font-semibold">Your Active Course</h2>
        <Separator className="my-2" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {activeCourses.length > 0 ? (
            activeCourses.map((course) => <CourseCard key={course.id} course={course} />)
          ) : (
            <p className="text-gray-500">No active courses yet.</p>
          )}
        </div>
      </div>

      {/* Review Course Section */}
      <div>
        <h2 className="text-lg font-semibold">Course Under Review</h2>
        <Separator className="my-2" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {reviewCourses.length > 0 ? (
            reviewCourses.map((course) => <CourseCard key={course.id} course={course} />)
          ) : (
            <p className="text-gray-500">No courses under review.</p>
          )}
        </div>
      </div>

      {/* Contribute Button */}
      <div className="flex justify-end pt-6">
        <Button
          className="rounded-md border-2 border-black bg-green-300 px-8 py-4 text-lg font-bold text-black hover:bg-green-400"
          onClick={() => setOpen(true)} // 👉 open modal
        >
          CONTRIBUTE
        </Button>
      </div>
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  return (
    <Card className="border border-gray-300 shadow-md">
      <CardContent className="p-4">
        <h3 className="text-lg font-bold">{course.title}</h3>
        <p className="mb-3 text-sm text-gray-600">{course.description}</p>
        <div className="flex items-center justify-between text-sm">
          <span>⭐ {course.rating}</span>
          <span>{course.tokens} Token</span>
        </div>
        <div className="mt-3 flex justify-end">
          {course.status === 'active' ? (
            <Button className="bg-purple-600 text-white hover:bg-purple-700">Edit Course</Button>
          ) : (
            <Button className="bg-gray-300 text-gray-700" disabled>
              Get Course
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
