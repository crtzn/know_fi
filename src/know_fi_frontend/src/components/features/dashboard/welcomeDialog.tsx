import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import fullOwl from '@/public/assets/fullOwl.svg';
import knowfilogo from '@/public/assets/knowfilogo.svg';

import { TypingAnimation } from './OwlTips';

export function DialogDemo() {
  const tips = [
    'Ready to level up your skills? Dive into our courses, ace quizzes, and mint tokens for your achievements.',
    'Welcome to the future of learning! Join our growing community and start earning while you master blockchain.',
    'Did you know? Consistency is the key to mastering new skills. Keep learning every day!',
    'Earn while you learn! Unlock rewards as you complete blockchain lessons.',
    'Every lesson you finish brings you closer to minting your very own NFT collectible!',
    'NFTs you earn here are unique — you can keep them, trade them, or show them off in your digital wallet.',
    'The Internet Computer (ICP) lets you build powerful decentralized apps — fast, secure, and on-chain.',
    'Learning ICP opens the door to creating dapps, smart contracts, and even hosting websites fully on blockchain.',
    'Knowledge is your superpower! The more you learn, the more rewards and NFTs you can mint.',
    'Blockchain isn’t just about tokens — it’s about creating value, owning your digital future, and sharing it globally.',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tips.length);
    }, 15000);

    return () => clearInterval(interval);
  }, [tips.length]);

  return (
    <Dialog defaultOpen open={open} onOpenChange={setOpen}>
      <DialogContent
        onClick={() => setOpen(false)}
        className="size-full max-h-[58vh] max-w-[600px] overflow-y-auto [&>button]:hidden"
      >
        <DialogHeader className="space-y-0">
          <DialogTitle className="flex items-center justify-center gap-2 text-5xl">
            <span className="">Welcome to</span>
            <Image unoptimized src={knowfilogo} alt="KnowFi" width={60} height={60} className="inline-block" />
            <span>KnowFi</span>
          </DialogTitle>
          <DialogDescription className="flex items-center justify-center">
            Click anywhere to continue.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-row p-4">
          <div className="flex items-end justify-end pl-5">
            <Image src={fullOwl} alt="Owl" width={125} height={125} unoptimized />
          </div>
          <div className="relative h-[148px] w-full">
            {/* Smallest circle - closer to owl */}
            <div className="absolute -left-2 bottom-[85px] size-3 rounded-full bg-[#E0C2FF]"></div>

            {/* Medium circle */}
            <div className="absolute bottom-[95px] left-0 size-5 rounded-full bg-[#E0C2FF]"></div>

            {/* Large circle */}
            <div className="absolute bottom-[110px] left-3 size-8 rounded-full bg-[#E0C2FF]"></div>

            {/* Main thought bubble */}
            <div className="absolute bottom-14 left-12 flex h-full w-[85%] items-center rounded-3xl bg-[#E0C2FF] p-6">
              <TypingAnimation className="text-xl font-bold" duration={20} text={tips[currentIndex]} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
