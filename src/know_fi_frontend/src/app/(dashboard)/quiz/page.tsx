'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useQuizProgress } from '@/hooks/useQuizProgress';
import { UserProfile } from '@/hooks/userProfile';
import coinIcon from '@/public/assets/icon-coin.svg';

interface QuizResult {
  level: string;
  isCorrect: boolean;
}

// Modal component for quit confirmation and results
interface QuitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  totalTokens: number;
  correctAnswers: number;
  totalQuestions: number;
}

const QuitModal: React.FC<QuitModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  totalTokens,
  correctAnswers,
  totalQuestions,
}) => {
  if (!isOpen) return null;

  return (
    <div className="pixel-font fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative mx-4 w-full max-w-md">
        {/* 8-bit styled modal */}
        <div className="relative border-4 border-black bg-[#FFE066]">
          {/* Pixelated corners */}
          <div className="absolute -left-1 -top-1 h-3 w-3 bg-black"></div>
          <div className="absolute -right-1 -top-1 h-3 w-3 bg-black"></div>
          <div className="absolute -bottom-1 -left-1 h-3 w-3 bg-black"></div>
          <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-black"></div>

          <div className="p-8">
            {/* Header with pixelated design */}
            <div className="mb-6 text-center">
              <h2 className="mb-2 text-2xl font-bold text-[#2D1B69]">GAME OVER!</h2>
              <div className="mb-4 h-1 w-full bg-[#2D1B69]"></div>
            </div>

            {/* Stats display */}
            <div className="mb-6 space-y-4">
              <div className="border-2 border-black bg-[#65009F] p-4 text-white">
                <div className="flex items-center justify-between">
                  <span className="text-lg">SCORE:</span>
                  <span className="text-xl font-bold">
                    {correctAnswers}/{totalQuestions}
                  </span>
                </div>
              </div>

              <div className="border-2 border-black bg-[#2D1B69] p-4 text-white">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-lg">
                    <Image src={coinIcon} alt="coin" className="h-6 w-6" />
                    TOKENS:
                  </span>
                  <span className="text-xl font-bold">{totalTokens}</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-center gap-4">
              <button
                onClick={onClose}
                className="border-2 border-black bg-[#4CAF50] px-6 py-3 font-bold text-white transition-all hover:translate-x-1 hover:translate-y-1 hover:bg-[#45a049]"
              >
                CONTINUE
              </button>
              <button
                onClick={onConfirm}
                className="border-2 border-black bg-[#f44336] px-6 py-3 font-bold text-white transition-all hover:translate-x-1 hover:translate-y-1 hover:bg-[#da190b]"
              >
                QUIT GAME
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Quiz() {
  const router = useRouter();
  const { actors, isAuthenticated } = useAuth();
  const { currentEnergy } = UserProfile();
  const { isCorrect, currentQuestion, nextQuestion, handleAnswer, options } = useQuizProgress();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(20);
  const TIMER_DURATION = 20;

  // Power-up states
  const [freezeUsed, setFreezeUsed] = useState(false);
  const [removeUsed, setRemoveUsed] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [hiddenOptions, setHiddenOptions] = useState<number[]>([]);
  const [answer, setAnswer] = useState<QuizResult[]>([]);

  // Modal and game stats
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [totalTokensEarned, setTotalTokensEarned] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [totalQuestionsAnswered, setTotalQuestionsAnswered] = useState(0);

  // For debugging, just checking what the user current progress.
  useEffect(() => {
    console.log('Current Question:  ', currentQuestion);
    const fetchCategories = async () => {
      const categories = await actors.quiz?.getUserQuizCategories();
    };
    fetchCategories();
    console.log('user select: ', selectedOption);
  }, [selectedOption]);

  // Reset power-up effects on new question
  useEffect(() => {
    setSelectedOption(null);
    setIsFrozen(false);
    setHiddenOptions([]);
  }, [currentQuestion]);

  // Timer effect
  useEffect(() => {
    setTimeLeft(TIMER_DURATION);
  }, [currentQuestion]);

  useEffect(() => {
    if (selectedOption) return;
    if (isFrozen) return;
    if (timeLeft === 0) {
      nextQuestion();
      return;
    }
    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, selectedOption, nextQuestion, isFrozen]);

  // Update stats when answer is selected
  useEffect(() => {
    if (selectedOption && currentQuestion) {
      setTotalQuestionsAnswered((prev) => prev + 1);
      if (isCorrect) {
        setCorrectAnswersCount((prev) => prev + 1);
        setTotalTokensEarned((prev) => prev + currentQuestion.token_reward);
      }
    }
  }, [selectedOption, isCorrect, currentQuestion]);

  // Freeze Timer Power-up
  const handleFreeze = () => {
    if (freezeUsed || isFrozen) return;
    setFreezeUsed(true);
    setIsFrozen(true);
    setTimeout(() => {
      setIsFrozen(false);
    }, 5000);
  };

  // Remove Wrong Answers Power-up
  const handleRemoveWrong = () => {
    if (removeUsed) return;
    setRemoveUsed(true);
    const wrongIndices = options
      .map((opt, idx) => (opt !== currentQuestion.correct_answer ? idx : null))
      .filter((idx) => idx !== null);
    const toHide = wrongIndices.sort(() => 0.5 - Math.random()).slice(0, 2);
    setHiddenOptions(toHide);
  };

  const handleQuit = () => {
    setShowQuitModal(true);
  };

  const confirmQuit = () => {
    setShowQuitModal(false);
    if (isAuthenticated) {
      router.push('/');
      setTimeout(() => {
        window.location.reload();
      }, 100); // Slight delay to ensure navigation completes
    } else {
      // router.push('/login');
      console.error('User is not authenticated. Cannot navigate to /');
    }
  };

  if (!currentQuestion) return <div>Loading...</div>;

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

        .pixel-font {
          font-family: 'Press Start 2P', monospace;
          image-rendering: pixelated;
          image-rendering: -moz-crisp-edges;
          image-rendering: crisp-edges;
        }

        .pixel-border {
          position: relative;
        }

        .pixel-border::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background:
            linear-gradient(45deg, black 25%, transparent 25%), linear-gradient(-45deg, black 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, black 75%), linear-gradient(-45deg, transparent 75%, black 75%);
          background-size: 4px 4px;
          background-position:
            0 0,
            0 2px,
            2px -2px,
            -2px 0px;
          z-index: -1;
        }

        .retro-shadow {
          box-shadow: 6px 6px 0 rgba(0, 0, 0, 1);
        }

        .retro-shadow:hover {
          box-shadow: 3px 3px 0 rgba(0, 0, 0, 1);
          transform: translate(3px, 3px);
        }

        .progress-bar-8bit {
          background: repeating-linear-gradient(90deg, #4caf50 0px, #4caf50 4px, #45a049 4px, #45a049 8px);
        }
      `}</style>

      <div className="pixel-font container mx-auto mt-10">
        {/* Header with Quit Button */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#2D1B69]">QUIZ BATTLE</h1>
          <button
            onClick={handleQuit}
            className="retro-shadow border-2 border-black bg-[#f44336] px-6 py-3 font-bold text-white transition-all hover:bg-[#da190b]"
          >
            QUIT GAME
          </button>
        </div>

        {/* Game Stats Bar */}
        <div className="mb-4 flex items-center gap-4 border-2 border-black bg-[#2D1B69] p-4 text-white">
          <div className="flex items-center gap-2">
            <span className="text-[#FFE066]">LVL:</span>
            <span className="font-bold">{currentQuestion?.difficulty}</span>
          </div>
          <div className="h-6 w-1 bg-[#FFE066]"></div>
          <div className="flex items-center gap-2">
            <Image src={coinIcon} alt="coin_icon" className="h-5 w-5" />
            <span className="font-bold text-[#FFE066]">{currentQuestion?.token_reward}</span>
          </div>
          <div className="mx-4 flex-1">
            <div className="relative h-6 overflow-hidden border-2 border-black bg-[#65009F]">
              <div
                className="progress-bar-8bit h-full transition-all duration-300"
                style={{ width: `${(timeLeft / TIMER_DURATION) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="min-w-[60px] text-center text-xl font-bold text-[#FFE066]">{timeLeft}s</div>
        </div>

        {/* Power-up Buttons */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={handleFreeze}
            disabled={freezeUsed || isFrozen}
            className={`retro-shadow border-2 border-black px-4 py-3 font-bold transition-all ${
              freezeUsed || isFrozen
                ? 'cursor-not-allowed bg-gray-400 text-gray-600'
                : 'bg-[#00BCD4] text-white hover:bg-[#0097A7]'
            }`}
          >
            🧊 FREEZE
          </button>
          <button
            onClick={handleRemoveWrong}
            disabled={removeUsed}
            className={`retro-shadow border-2 border-black px-4 py-3 font-bold transition-all ${
              removeUsed ? 'cursor-not-allowed bg-gray-400 text-gray-600' : 'bg-[#FF9800] text-white hover:bg-[#F57C00]'
            }`}
          >
            ❌ REMOVE
          </button>
        </div>

        {/* Question Card */}
        <div className="mb-8">
          <Card className="retro-shadow border-4 border-black bg-[#FFE066]">
            <CardHeader className="p-8">
              <CardTitle className="text-center text-2xl leading-relaxed text-[#2D1B69]">
                {currentQuestion.question}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-2 gap-6">
          {options.map((option: string, idx: number) => {
            if (hiddenOptions.includes(idx)) {
              return (
                <div key={idx} className="flex items-center justify-center">
                  <div className="flex h-32 w-full items-center justify-center border-2 border-gray-400 bg-gray-300 text-gray-500">
                    <span className="text-xl">DISABLED</span>
                  </div>
                </div>
              );
            }

            let buttonClass = 'bg-white text-[#2D1B69] hover:bg-[#f0f0f0]';
            if (selectedOption) {
              if (option === currentQuestion.correct_answer) {
                buttonClass = 'bg-[#4CAF50] text-white';
              } else if (option === selectedOption && isCorrect === false) {
                buttonClass = 'bg-[#f44336] text-white';
              } else {
                buttonClass = 'bg-gray-200 text-gray-600';
              }
            }

            return (
              <div key={idx}>
                <button
                  className={`retro-shadow h-32 w-full border-4 border-black p-4 text-lg font-bold transition-all disabled:cursor-not-allowed ${buttonClass}`}
                  onClick={async () => {
                    if (!selectedOption) {
                      await handleAnswer(option);
                      setSelectedOption(option);
                    }
                  }}
                  disabled={!!selectedOption}
                >
                  <div className="flex h-full items-center justify-center break-words text-center leading-tight">
                    {option}
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quit Modal */}
      <QuitModal
        isOpen={showQuitModal}
        onClose={() => setShowQuitModal(false)}
        onConfirm={confirmQuit}
        totalTokens={totalTokensEarned}
        correctAnswers={correctAnswersCount}
        totalQuestions={totalQuestionsAnswered}
      />
    </>
  );
}
