'use client';

import { CoursesCard } from '@/components/features/courses/CourseCard';
import useClient from '@/core/hooks/utils/useClient';

export default function Home() {
  const { isClient } = useClient();

  return (
    <main className="font-sans">
      {isClient && (
        <div className="flex flex-col gap-20">
          {/* Top part */}
          <div className="flex">
            <div className="flex flex-col">
              <h1 className="mb-5 text-5xl font-bold">Courses</h1>
              <span>List of course you can take by unlocking with a tokens. Token</span>
              <span>earned by taking a quiz or buying in the marketplace</span>
            </div>
          </div>

          {/* Graphs and charts section */}
          {/* LEFT */}
          <div className="flex gap-20">
            <div className="w-6/12">
              <CoursesCard />
            </div>
            <div className="w-6/12">
              <CoursesCard />
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex gap-20">
            <div className="w-6/12">
              <CoursesCard />
            </div>
            <div className="mb-10 w-6/12">
              <CoursesCard />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
