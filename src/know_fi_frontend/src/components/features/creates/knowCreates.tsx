import React from 'react';

import knowCreatesBg from '@/components/common/knowCreates-bg/knowCreatesBg.png';

export function KnowCreates() {
  return (
    <div className="relative h-60 w-full overflow-hidden">
      {/* Banner Image */}
      <img src={knowCreatesBg.src} alt="KnowCreates Banner" className="h-full w-full object-cover" />

      {/* Centered Text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-4xl font-bold">
          <span className="text-4xl font-bold text-white [text-shadow:2px_2px_0_#000,-2px_-2px_0_#000,2px_-2px_0_#000,-2px_2px_0_#000]">
            KNOW
          </span>
          <span className="text-4xl font-bold text-white [text-shadow:2px_2px_0_#000,-2px_-2px_0_#000,2px_-2px_0_#000,-2px_2px_0_#000]">
            CREATES
          </span>
        </h1>
      </div>
    </div>
  );
}
