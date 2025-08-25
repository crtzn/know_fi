'use client';

import { Facebook, Handshake, MessageCircleMore, MessageCircleQuestionMark, UserRoundPen, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import useClient from '@/core/hooks/utils/useClient';
import { useDailyClaim } from '@/hooks/useDailyClaim';
import Owl from '@/public/assets/fullOwl.svg';
import bannerImg from '@/public/assets/quest-banner.png';

const QUEST_DATA = [
  {
    id: 0,
    icon: <UserRoundPen />,
    title: 'Set up profile',
    url: 'http://localhost:3000/profile/',
    reward: 10,
  },
  {
    id: 1,
    icon: <MessageCircleMore />,
    title: 'Send a GM to our forum chat',
    url: 'http://localhost:3000/forum/',
    reward: 10,
  },
  {
    id: 2,
    icon: <Facebook />,
    title: 'Follow KnowFi',
    url: 'https://www.facebook.com/knowfiGOAT',
    reward: 10,
  },
  {
    id: 3,
    icon: <X />,
    title: 'Follow KnowFi',
    url: 'https://x.com/knowfiGOAT',
    reward: 10,
  },
  {
    id: 4,
    icon: <Facebook />,
    title: 'Follow ICP PH',
    url: 'https://www.facebook.com/ICPHubPH',
    reward: 10,
  },
  {
    id: 5,
    icon: <X />,
    title: 'Follow ICP PH',
    url: 'https://x.com/icphub_PH',
    reward: 10,
  },
  {
    id: 6,
    icon: <X />,
    title: 'Follow ICP HUB',
    url: 'https://x.com/ICPHUBS',
    reward: 10,
  },
  {
    id: 7,
    icon: <MessageCircleQuestionMark />,
    title: 'Complete 5 Quiz Question',
    url: 'http://localhost:3000/',
    reward: 10,
  },
  {
    id: 8,
    icon: <Handshake />,
    title: 'Refer 0/3 friends',
    url: 'http://localhost:3000/quest/',
    reward: 10,
  },
];

// interface QuestData {
//   id: number;
//   icon: LucideIcon;
//   title: string;
//   url: string;
//   number: number;
// }

export default function Home() {
  const { isClient } = useClient();
  const { claimDaily, isLoading, canClaim, timeRemaining } = useDailyClaim();
  const { actors } = useAuth();
  const [completedQuests, setCompletedQuests] = useState<number[]>([]);

  const completeQuest = async (questId: number) => {
    if (completedQuests.includes(questId)) {
      console.log('quest already completed!');
      return;
    }
    try {
      await actors.quest.completeQuest();
      setCompletedQuests((prev) => [...prev, questId]);
    } catch (error) {
      console.log('Error for completing the quests: ', error);
    }
  };

  const handleQuestClick = (quest: any) => {
    console.log('clicked quest:', quest);
    completeQuest(quest.id);
  };

  return (
    <main className="overflow-hidden font-sans">
      {isClient && (
        <div>
          <div
            className="flex w-full items-center justify-center"
            style={{
              backgroundImage: `url(${bannerImg.src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              minHeight: '200px',
              position: 'relative',
            }}
          >
            <h2 className="text-center text-3xl font-bold">
              <span className="text-[#65009F]">KNOW</span>
              QUEST
            </h2>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center px-4">
            <Button
              className={`translate-x-1 translate-y-1 border border-black px-12 py-4 text-4xl font-bold text-black shadow-[2px_2px_0_rgba(0,0,0,1)] ${canClaim ? 'bg-[#69FFB5]' : 'bg-gray-200'}`}
              onClick={claimDaily}
              disabled={isLoading || !canClaim}
            >
              {isLoading ? 'CLAIMING...' : canClaim ? 'DAILY CLAIM' : timeRemaining}
            </Button>

            <p className="mt-4 text-center">Achieve the tasks to earn $KNF</p>
          </div>

          <div className="some-quests mt-10 flex w-full flex-col gap-2">
            {QUEST_DATA.map((quest) => {
              const isQuestCompleted = completedQuests.includes(quest.id);

              return (
                <div key={quest.id} className="flex w-full justify-center">
                  <Card className="flex h-16 w-5/12 items-center rounded-none p-1">
                    <CardHeader>{quest.icon}</CardHeader>
                    <CardTitle className="flex w-full justify-start">{quest.title}</CardTitle>
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        if (!isQuestCompleted) {
                          handleQuestClick(quest);
                        }
                      }}
                      disabled={isQuestCompleted}
                      className={`w-40 rounded border border-black text-xl text-black ${
                        isQuestCompleted ? 'cursor-not-allowed bg-gray-300' : 'bg-[#69FFB5]'
                      }`}
                    >
                      <Link href={quest.url} target="">
                        {isQuestCompleted ? 'DONE' : `+${quest.reward} $KNF`}
                      </Link>
                    </Button>
                  </Card>
                </div>
              );
            })}
          </div>
          <div className="my-10 flex w-full items-center justify-center">
            <Image src={Owl.src} alt="Owl" width={100} height={100} className="mr-5" />
            <div>
              <div className="flex flex-col items-center justify-center align-middle">
                <h2 className="text-2xl font-medium">Invite A Friend</h2>
                <p className="text-center">
                  Having fun? Share the love with a friend! <br />
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
