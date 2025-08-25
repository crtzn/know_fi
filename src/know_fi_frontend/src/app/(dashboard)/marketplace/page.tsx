'use client';

import useClient from '@/core/hooks/utils/useClient';
import marketplace from '@/public/assets/marketplace.svg';

export default function Home() {
  const { isClient } = useClient();

  return (
    <main className="font-sans">
      {isClient && (
        <div>
          {/* Top part */}
          <div
            className="flex w-full items-center justify-center"
            style={{
              backgroundImage: `url(${marketplace.src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              minHeight: '200px',
              position: 'relative',
            }}
          >
            <h2 className="text-center text-3xl font-bold text-white">MARKETPLACE</h2>
          </div>

          {/* Graphs and charts section */}
          <div className="flex h-screen items-center justify-center text-5xl font-bold">
            <p className="rounded-lg border-4 border-black p-4">Coming soon...</p>
          </div>
        </div>
      )}
    </main>
  );
}
