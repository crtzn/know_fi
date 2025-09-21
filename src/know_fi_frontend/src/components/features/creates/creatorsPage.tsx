'use client';

import { useState } from 'react';

import { KnowCreatesContribute } from '@/components/features/creates/knowCreatesContribute';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCreatorCourses } from '@/hooks/useCreatorCourses';
import type { Course } from '@/types/course';

export function CreatorsPage() {
  const { courses, isLoading, error, refetch } = useCreatorCourses();
  const [open, setOpen] = useState(false);

  const activeCourses = courses.filter((c) => c.status === 'approved');
  const reviewCourses = courses.filter((c) => c.status === 'pending');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading your courses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 p-8">
        <div className="text-red-600">Error loading courses: {error}</div>
        <Button onClick={refetch}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Creators Page</h1>
        <Button onClick={refetch} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      {/* Active Course Section */}
      <div>
        <h2 className="text-lg font-semibold">Your Active Courses ({activeCourses.length})</h2>
        <Separator className="my-2" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {activeCourses.length > 0 ? (
            activeCourses.map((course) => <CourseCard key={course.id} course={course} />)
          ) : (
            <p className="text-gray-500">No active courses yet. Create your first course to get started!</p>
          )}
        </div>
      </div>

      {/* Review Course Section */}
      <div>
        <h2 className="text-lg font-semibold">Courses Under Review ({reviewCourses.length})</h2>
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

      {/* Course Creation Modal/Component */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-lg bg-white">
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-xl font-bold">Create New Course</h2>
              <Button variant="ghost" onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </Button>
            </div>
            <div className="p-4">
              <KnowCreatesContribute />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  const getStatusBadge = (status: Course['status']) => {
    switch (status) {
      case 'approved':
        return <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">✓ Approved</span>;
      case 'pending':
        return <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800">⏳ Under Review</span>;
      case 'rejected':
        return <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-800">✗ Rejected</span>;
      default:
        return <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-800">Unknown</span>;
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(Number(timestamp) / 1000000).toLocaleDateString();
  };

  return (
    <Card className="border border-gray-300 shadow-md">
      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="line-clamp-2 text-lg font-bold">{course.title}</h3>
          {getStatusBadge(course.status)}
        </div>
        <p className="mb-3 line-clamp-3 text-sm text-gray-600">{course.description}</p>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span>
              ⭐ {course.rating.toFixed(1)} ({course.review_count} reviews)
            </span>
            <span className="font-medium">{course.token_reward} Tokens</span>
          </div>

          <div className="flex items-center justify-between">
            <span>👥 {course.student_count} students</span>
            <span className="text-gray-500">Created: {formatDate(course.created_at)}</span>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Category: {course.category}</span>
            <span>Difficulty: {course.difficulty}</span>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          {course.status === 'approved' ? (
            <Button className="bg-purple-600 text-white hover:bg-purple-700">View Course</Button>
          ) : course.status === 'pending' ? (
            <Button className="bg-yellow-500 text-white hover:bg-yellow-600" disabled>
              Under Review
            </Button>
          ) : (
            <Button className="bg-gray-300 text-gray-700" disabled>
              Rejected
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
