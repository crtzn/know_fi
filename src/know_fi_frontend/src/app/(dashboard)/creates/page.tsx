'use client';

import React, { useEffect, useState } from 'react';

import { CreatorsPage } from '@/components/features/creates/creatorsPage';
import { KnowCreates } from '@/components/features/creates/knowCreates';
import { KnowCreatesContribute } from '@/components/features/creates/knowCreatesContribute';

export default function Creates() {
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('hasData');
    setHasData(stored === 'true');
  }, []);

  return (
    <div className="">
      {hasData ? (
        // Show this if data already exists
        <div className="flex flex-col justify-center">
          <KnowCreates />
          <div className="">
            <CreatorsPage />
          </div>
        </div>
      ) : (
        // Show this if no data yet
        <div className="flex flex-col justify-center">
          <KnowCreates />
          <div className="">
            <KnowCreatesContribute />
          </div>
        </div>
      )}
    </div>
  );
}
