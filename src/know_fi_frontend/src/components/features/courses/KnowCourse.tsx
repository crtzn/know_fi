import React from 'react';

import knowCourseBg from '@/components/common/icons/know_course_bg.png';

export function KnowCourse() {
  return (
    <div className="relative h-60 w-full overflow-hidden">
      {/* Banner Image */}
      <img src={knowCourseBg.src} alt="KnowCourse Banner" className="h-full w-full object-cover" />

      {/* Centered Text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-4xl font-bold">
          <span className="text-purple-700">KNOW</span>
          <span className="text-black">COURSE</span>
        </h1>
      </div>
    </div>
  );
}
