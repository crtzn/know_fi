'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import mascot from '@/components/common/icons/mascot.png';

interface TypingAnimationProps {
  text: string;
  duration?: number;
  className?: string;
}

export function TypingAnimation({ text, duration = 200, className = '' }: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let i = 0;
    setDisplayedText('');

    const typingEffect = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingEffect);
      }
    }, duration);

    return () => clearInterval(typingEffect);
  }, [text, duration]);

  return <h1 className={className}>{displayedText || text}</h1>;
}

//rotating messages
export function MrOwlTips() {
  const tips = [
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tips.length);
    }, 15000);

    return () => clearInterval(interval);
  }, [tips.length]);

  return (
    <div className="flex flex-row">
      <div className="flex items-end justify-end pl-3">
        <Image src={mascot} alt="Logo" width={115} height={115} unoptimized />
      </div>
      <div className="relative h-32 w-full">
        {/* Smallest circle */}
        <div className="absolute bottom-[75px] left-0 size-3 rounded-full bg-[#E0C2FF]"></div>

        {/* Medium circle */}
        <div className="absolute bottom-[90px] left-2 size-5 rounded-full bg-[#E0C2FF]"></div>

        {/* Large circle */}
        <div className="absolute bottom-28 left-5 size-8 rounded-full bg-[#E0C2FF]"></div>

        {/* Main thought bubble */}
        <div className="absolute bottom-20 left-14 flex h-full w-[92%] items-center rounded-3xl bg-[#E0C2FF] p-6">
          <TypingAnimation className="text-2xl font-bold" duration={20} text={tips[currentIndex]} />
        </div>
      </div>
    </div>
  );
}
