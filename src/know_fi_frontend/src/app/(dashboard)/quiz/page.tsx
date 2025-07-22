'use client';

import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useQuizProgress } from '@/hooks/useQuizProgress';

export default function Quiz() {
  const { actor } = useAuth();
  const { isCorrect, currentQuestion, nextQuestion, handleAnswer, options } = useQuizProgress();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // For debugging, just checking what the user current progress.
  useEffect(() => {
    console.log('Current Question:  ', currentQuestion);
    const fetchCategories = async () => {
      const categories = await actor?.getUserQuizCategories();
    };
    fetchCategories();
    console.log('user select: ', selectedOption);
  }, [selectedOption]);

  useEffect(() => {
    setSelectedOption(null);
  }, [currentQuestion]);

  if (!currentQuestion) return <div>Loading...</div>;

  return (
    <div className="container mx-auto mt-10">
      <Card className="h-80 rounded-none border-2 border-black bg-white shadow-[4px_4px_0_rgba(0,0,0,1)]">
        <CardHeader className="flex h-full justify-center text-center">
          <CardTitle className="text-4xl">{currentQuestion.question}</CardTitle>
        </CardHeader>
      </Card>

      {/* choices area here */}
      <div className="mt-10 grid grid-cols-2 items-center justify-center gap-5 align-middle">
        {options.map((option: string, idx: number) => {
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
                onClick={() => {
                  if (!selectedOption) {
                    handleAnswer(option);
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
      <div className="mt-5 flex w-full justify-end">
        <Button className="w-1/4" onClick={nextQuestion} disabled={!selectedOption}>
          Next
        </Button>
      </div>
    </div>
  );
}
