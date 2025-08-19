import React from 'react';

import { Analytics } from '@/components/features/profile/analytics';
import { Blank } from '@/components/features/profile/blank';
import { Information } from '@/components/features/profile/information';
import { PostBadges } from '@/components/features/profile/postBadges';
import { ProfileCard } from '@/components/features/profile/profileCard';
import { QuizHistory } from '@/components/features/profile/quiz_history';
import { Socials } from '@/components/features/profile/socials';

export default function profile() {
  return (
    <div className="container">
      {/* Top part */}
      <div className="container">
        <div className="flex flex-col gap-10">
          <div>
            <ProfileCard />
          </div>
          <div className="flex gap-10">
            {/* Left Column */}
            <div className="flex flex-col gap-5">
              <Information />
              <Socials />
              <QuizHistory />
            </div>

            {/* Right Column */}
            <div className="flex w-full flex-col gap-5">
              <Analytics />
              <Blank />
              <PostBadges />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
