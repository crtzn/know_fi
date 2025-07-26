import Image from 'next/image';
import React from 'react';

import { Button } from '@/components/ui/button';
import quizModalIMG from '@/public/assets/01_quiz_start.png';

export default function quizStartModal() {
  return (
    <div>
      <Image src={quizModalIMG} alt="start-quiz-modal-img" />
      <h1>Quiz Mechanics</h1>
      <p>
        When taking a quiz, correct answer are revealed right after you choose your answer, and you then proceed to the
        next question
      </p>
      <Button>Start quiz</Button>
    </div>
  );
}
