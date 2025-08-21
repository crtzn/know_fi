'use client';

import Image from 'next/image';
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

export default function Quiz() {
  const { actors } = useAuth();
  const { currentEnergy } = UserProfile();
  const { isCorrect, currentQuestion, nextQuestion, handleAnswer, options } = useQuizProgress();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(20); // 20 seconds timer
  const TIMER_DURATION = 20;

  // Power-up states
  const [freezeUsed, setFreezeUsed] = useState(false);
  const [removeUsed, setRemoveUsed] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [hiddenOptions, setHiddenOptions] = useState<number[]>([]);
  const [answer, setAnswer] = useState<QuizResult[]>([]);

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
    setTimeLeft(TIMER_DURATION); // Reset timer on new question
  }, [currentQuestion]);

  useEffect(() => {
    if (selectedOption) return; // Stop timer if answered
    if (isFrozen) return; // Pause timer if frozen
    if (timeLeft === 0) {
      nextQuestion();
      return;
    }
    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, selectedOption, nextQuestion, isFrozen]);

  // Freeze Timer Power-up
  const handleFreeze = () => {
    if (freezeUsed || isFrozen) return;
    setFreezeUsed(true);
    setIsFrozen(true);
    setTimeout(() => {
      setIsFrozen(false);
    }, 5000); // Freeze for 5 seconds
  };

  // Remove Wrong Answers Power-up
  const handleRemoveWrong = () => {
    if (removeUsed) return;
    setRemoveUsed(true);
    // Find indices of wrong answers
    const wrongIndices = options
      .map((opt, idx) => (opt !== currentQuestion.correct_answer ? idx : null))
      .filter((idx) => idx !== null);
    // Randomly pick 2 to hide
    const toHide = wrongIndices.sort(() => 0.5 - Math.random()).slice(0, 2);
    setHiddenOptions(toHide);
  };

  const getResult = () => {};

  if (!currentQuestion) return <div>Loading...</div>;

  return (
    <div className="container mx-auto mt-10">
      {/* Timer Progress Bar & Power-ups */}

      <div className="mb-4 flex items-center gap-4">
        <p className="font-medium">Level: {currentQuestion?.difficult}</p>
        <span className="separator">|</span>
        <div className="flex gap-3">
          <Image src={coinIcon} alt="coin_icon" />
          <p>{currentQuestion?.token_reward}</p>
        </div>
        <Progress value={(timeLeft / TIMER_DURATION) * 100} className="h-4 flex-1" />
        <span className="w-12 text-center text-lg font-bold">{timeLeft}s</span>
        {/* Power-up Buttons */}
        <button
          onClick={handleFreeze}
          disabled={freezeUsed || isFrozen}
          className={`ml-2 rounded-md border-2 border-black px-3 py-2 font-bold shadow-[4px_4px_0_rgba(60,0,94,1)] transition-all ${
            freezeUsed || isFrozen
              ? 'cursor-not-allowed bg-gray-300 text-gray-500'
              : 'bg-[#65009F] text-white hover:bg-[#3C005E]'
          }`}
        >
          🧊 Freeze Timer
        </button>
        <button
          onClick={handleRemoveWrong}
          disabled={removeUsed}
          className={`ml-2 rounded-md border-2 border-black px-3 py-2 font-bold shadow-[4px_4px_0_rgba(60,0,94,1)] transition-all ${
            removeUsed ? 'cursor-not-allowed bg-gray-300 text-gray-500' : 'bg-[#65009F] text-white hover:bg-[#3C005E]'
          }`}
        >
          ❌ Remove Wrong
        </button>
      </div>
      <Card className="h-80 rounded-none border-2 border-black bg-white shadow-[4px_4px_0_rgba(0,0,0,1)]">
        <CardHeader className="flex h-full justify-center text-center">
          <CardTitle className="text-4xl">{currentQuestion.question}</CardTitle>
        </CardHeader>
      </Card>

      {/* choices area here */}
      <div className="mt-10 grid grid-cols-2 items-center justify-center gap-5 align-middle">
        {options.map((option: string, idx: number) => {
          if (hiddenOptions.includes(idx)) {
            return (
              <div key={idx} className="flex w-full items-center justify-center align-middle">
                <Button
                  className="size-full h-36 cursor-not-allowed rounded-none border-2 border-black bg-gray-200 text-gray-400 shadow-none"
                  disabled
                ></Button>
              </div>
            );
          }
          let buttonClass = '';
          if (selectedOption) {
            if (option === currentQuestion.correct_answer) {
              buttonClass = 'bg-[#65009F] text-white';
            } else if (option === selectedOption && isCorrect === false) {
              buttonClass = 'bg-red-500 text-white';
            } else {
              buttonClass = 'bg-white text-black';
            }
          }

          return (
            <div key={idx} className="flex w-full items-center justify-center align-middle">
              <Button
                className={`size-full h-36 overflow-hidden rounded-none border-2 border-black bg-white text-black shadow-[4px_4px_0_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:bg-white hover:shadow-[2px_2px_0_rgba(0,0,0,1)] ${buttonClass}`}
                onClick={async () => {
                  if (!selectedOption) {
                    await handleAnswer(option);
                    setSelectedOption(option);
                  }
                }}
                disabled={!!selectedOption}
              >
                {option}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
