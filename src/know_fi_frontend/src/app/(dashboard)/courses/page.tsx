'use client';

import { CoursesCard } from '@/components/features/courses/CourseCard';
import Template from '@/components/sample/template';
import useClient from '@/core/hooks/utils/useClient';

export default function Home() {
  const { isClient } = useClient();

  return (
    <main className="font-sans">
      {isClient && (
        <div className="flex flex-col gap-20">
          {/* Top part */}
          <div className="flex">
            <div className="flex-col flex">
              <h1 className="font-bold text-5xl mb-5">Courses</h1>
              <span>List of course you can take by unlocking with a tokens. Token</span>
              <span>earned by taking a quiz or buying in the marketplace</span>
            </div>
          </div>

          {/* Graphs and charts section */}
          {/* LEFT */}
          <div className="flex gap-20">
            <div className="w-[50%]">
              <CoursesCard />
            </div>
            <div className="w-[50%]">
              <CoursesCard />
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex gap-20">
            <div className="w-[50%]">
              <CoursesCard />
            </div>
            <div className="w-[50%] mb-10">
              <CoursesCard />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
