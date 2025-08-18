import React from 'react';

import { KnowCourse } from '@/components/features/courses/KnowCourse';
import { KnowCourseTab } from '@/components/features/courses/KnowCourseTab';

export default function courses() {
  return (
    <div className="">
      <div className="flex flex-col justify-center">
        <KnowCourse />
        <div className="">
          <KnowCourseTab />
        </div>
      </div>
    </div>
  );
}
