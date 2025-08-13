'use client';

import useClient from '@/core/hooks/utils/useClient';

export default function Home() {
  const { isClient } = useClient();

  return (
    <main className="font-sans">
      {isClient && (
        <div>
          {/* Top part */}
          <div className="mb-20 flex">
            <div className="flex flex-col">
              <h1 className="mb-5 text-5xl font-bold">Community</h1>
              <span>
                This feature will be available in our Phase 2. Please visit <br /> website to view our porject roadmap.
              </span>
            </div>
          </div>

          {/* Graphs and charts section */}
          <div className="flex size-full items-center justify-center text-5xl font-bold">Coming soon...</div>
        </div>
      )}
    </main>
  );
}
