import { useCallback, useEffect, useState } from 'react';

import { shuffleArray } from '@/core/utils';
import { useAuth } from '@/hooks/useAuth';
import { quizData } from '@/providers/lib/quizData';

import { UserProfile } from './userProfile';

export const useQuizProgress = () => {
  const { actor } = useAuth();
  const { setCurrentEnergy, currentEnergy } = UserProfile();

  const [categories, setCategories] = useState<string[][]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    if (currentQuestion) {
      setOptions(shuffleArray(currentQuestion.options));
    }
  }, [currentQuestion]);

  // Fetch user categories
  useEffect(() => {
    const fetchUserQuizCategories = async () => {
      if (actor && actor.getUserQuizCategories) {
        const userCategories = await actor.getUserQuizCategories();
        console.log('user choice categories:', userCategories);
        setCategories(userCategories || []);
      }
    };
    fetchUserQuizCategories();
  }, [actor]);

  // Filter questions when categories change
  useEffect(() => {
    if (categories.length > 0) {
      const flatCategories = categories.flat();
      const normalizedCategories = flatCategories.map((c) => c.toLowerCase().trim());
      const filtered = quizData.filter((q) => normalizedCategories.includes(q.category.toLowerCase().trim()));
      setFilteredQuestions(filtered);

      // solving issue test here:  to always reset to current index to 0 after filtering
      setCurrentIndex(0);
    }
  }, [categories]);

  // Set currentQuestion when filteredQuestions or currentIndex changes
  useEffect(() => {
    if (filteredQuestions.length > 0 && currentIndex < filteredQuestions.length) {
      setCurrentQuestion(filteredQuestions[currentIndex]);
      console.log('Current Question:', filteredQuestions[currentIndex]);
    } else {
      setCurrentQuestion(null);
      console.log('Current Question:', null);
    }
  }, [filteredQuestions, currentIndex]);

  useEffect(() => {
    userTakeQuiz();
  }, []);

  // ==========================
  // handlers space
  // ===========================
  const nextQuestion = () => {
    if (filteredQuestions.length > 0) {
      const newIndex = Math.floor(Math.random() * filteredQuestions.length);
      setCurrentIndex(newIndex);
      setIsCorrect(null);
      userTakeQuiz();
    }
  };

  const handleAnswer = async (userAnswer: string) => {
    if (currentQuestion && userAnswer === currentQuestion.correct_answer) {
      setIsCorrect(true);
      // TODO: Add token rewards logic here
      console.log('Correct');

      setTimeout(() => {
        nextQuestion();
      }, 2000);
    } else {
      setIsCorrect(false);
      console.log('Incorrect');

      setTimeout(() => {
        nextQuestion();
      }, 1000);
    }
  };

  const userTakeQuiz = async () => {
    if (!actor) return;
    await actor?.userTakeTheQuiz();
    // Fetch the updated energy
    const updatedEnergy = await actor?.getEnergy();
    setCurrentEnergy(updatedEnergy);
    console.log('user energy; ', currentEnergy);
  };

  return { handleAnswer, nextQuestion, isCorrect, currentQuestion, filteredQuestions, options, userTakeQuiz };
};
