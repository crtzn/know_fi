'use client';

import Template from '@/components/sample/template';
import useClient from '@/core/hooks/utils/useClient';

export default function Home() {
  const { isClient } = useClient();

  return (
    <main className="font-sans">
      {isClient && (
        <div>
          {/* Top part */}
          <div className="flex mb-20">
            <div className="flex-col flex">
              <h1 className="font-bold text-5xl mb-5">Marketplace</h1>
              <span>This feature will be available in our Phase 2. Please visit</span>
              <span>website to view our porject roadmap.</span>
            </div>
          </div>

          {/* Graphs and charts section */}
          <div className="items-center justify-center w-full h-full flex font-bold text-5xl">Coming soon...</div>
        </div>
      )}
    </main>
  );
}
