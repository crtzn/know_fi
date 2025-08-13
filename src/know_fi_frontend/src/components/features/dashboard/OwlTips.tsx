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
  const [i, setI] = useState(0);

  useEffect(() => {
    const typingEffect = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.substring(0, i + 1));
        setI(i + 1);
      } else {
        clearInterval(typingEffect);
      }
    }, duration);

    return () => clearInterval(typingEffect);
  }, [duration, i, text]);

  return <h1 className={` ${className}`}>{displayedText || text}</h1>;
}

export function MrOwlTips() {
  return (
    <div className="flex flex-row">
      <div className="flex items-end justify-end">
        <Image src={mascot} alt="Logo" width={115} height={115} unoptimized />
      </div>
      <div className="relative h-32 w-full">
        {/* Smallest circle - bottom left */}
        <div className="absolute bottom-[75px] left-0 size-3 rounded-full bg-[#A7A7A7]"></div>

        {/* Medium circle */}
        <div className="absolute bottom-[90px] left-2 size-5 rounded-full bg-[#A7A7A7]"></div>

        {/* Large circle */}
        <div className="absolute bottom-28 left-5 size-8 rounded-full bg-[#A7A7A7]"></div>

        {/* Main thought bubble - top right */}
        <div className="absolute bottom-20 left-14 flex h-full w-[92%] items-center rounded-3xl bg-[#A7A7A7] p-6">
          <TypingAnimation
            className="text-2xl font-bold"
            duration={20}
            text="Welcome to the future of learning! Join our growing community and start earning while you master blockchain."
          />
        </div>
      </div>
    </div>
  );
}
