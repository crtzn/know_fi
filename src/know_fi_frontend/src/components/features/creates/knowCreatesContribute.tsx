'use client';

import React, { useState } from 'react';

import { Button } from '@/components/ui/button';

import { CreateStep1 } from './createStep1';
import { CreateStep2 } from './createStep2';
import { CreateStep3 } from './createStep3';
import { CreateStep4 } from './createStep4';

export function KnowCreatesContribute() {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | null>(null);

  // Shared state across steps
  const [creatorData, setCreatorData] = useState({
    fullName: '',
    linkedin: '',
    github: '',
    website: '',
  });

  const createsData = {
    heading: 'SHARE YOUR EXPERTISE, SHAPE THE FUTURE!',
    description:
      'KnowCreates is your platform to share your expertise and shape the future of decentralized education. Upload your high-quality courses and modules to help close the knowledge gap in Web3.',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6 text-center">
      {/* Heading */}
      <h1 className="text-6xl font-semibold italic">{createsData.heading}</h1>

      {/* Description */}
      <p className="max-w-4xl text-2xl text-gray-700">
        <span className="font-bold text-black">KnowCreates</span> {createsData.description.replace('KnowCreates', '')}
      </p>

      {/* Button */}
      <Button
        onClick={() => setStep(1)} // open Step 1
        className="rounded-md border-4 border-black bg-green-300 px-12 py-7 text-2xl font-bold text-black shadow-md hover:bg-green-400"
      >
        CONTRIBUTE
      </Button>

      {/* Step 1 */}
      <CreateStep1
        open={step === 1}
        onOpenChange={(open) => setStep(open ? 1 : null)}
        onNext={() => setStep(2)} // go to Step 2
        creatorData={creatorData}
        setCreatorData={setCreatorData} // ✅ pass state
      />

      {/* Step 2 */}
      <CreateStep2
        open={step === 2}
        onOpenChange={(open) => setStep(open ? 2 : null)}
        onBack={() => setStep(1)} // optional: go back
        onNext={() => setStep(3)} // go to Step 3
      />

      {/* Step 3 */}
      <CreateStep3
        open={step === 3}
        onOpenChange={(open) => setStep(open ? 3 : null)}
        onBack={() => setStep(2)} // optional: go back
        onNext={() => setStep(4)} // go to Step 4
      />

      {/* Step 4 */}
      <CreateStep4
        open={step === 4}
        onOpenChange={(open) => setStep(open ? 4 : null)}
        onBack={() => setStep(3)} // optional: go back
        creatorData={creatorData} // ✅ pass to Step 4
        onSubmit={() => {
          console.log('Submitting creator data:', creatorData);

          // 🔹 Save flag in localStorage
          localStorage.setItem('hasData', 'true');

          // 🔹 Close modal and reset step
          setStep(null);

          // 🔹 Optionally reload page to sync state in Creates.tsx
          window.location.reload();
        }}
      />
    </div>
  );
}
