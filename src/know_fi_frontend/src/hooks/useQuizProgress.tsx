import { useEffect, useState } from 'react';

import { useAuth } from '@/contexts/AuthContext';
import { QuizData } from '@/core/types/quizData.types';
import { shuffleArray } from '@/core/utils';
import { quizData } from '@/providers/lib/quizData';

import { UserProfile } from './userProfile';

export const useQuizProgress = () => {
  const { actors } = useAuth();
  const { setCurrentEnergy, currentEnergy } = UserProfile();

  const [categories, setCategories] = useState<string[][]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<QuizData>(null);
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
      if (actors.quiz && actors.quiz.getUserQuizCategories) {
        const userCategories = await actors.quiz.getUserQuizCategories();
        console.log('user choice categories:', userCategories);
        setCategories(userCategories || []);
      }
    };
    fetchUserQuizCategories();
  }, [actors]);

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

  // ==========================
  // handlers space
  // ===========================
  const nextQuestion = () => {
    if (filteredQuestions.length > 0) {
      const newIndex = Math.floor(Math.random() * filteredQuestions.length);
      setCurrentIndex(newIndex);
      setIsCorrect(null);
    }
  };

  /**
   * Need to get the user answers, now if correct need ko makuha if anong level, then is correct
   */

  const handleAnswer = async (userAnswer: string) => {
    if (!currentQuestion) return;

    const isCorrect = userAnswer === currentQuestion.correct_answer;

    // Map your question's level to the Motoko variant
    let levelVariant;
    switch (currentQuestion.difficulty) {
      case 'easy':
        levelVariant = { easy: null };
        break;
      case 'medium':
        levelVariant = { medium: null };
        break;
      case 'hard':
        levelVariant = { hard: null };
        break;
      default:
        levelVariant = { easy: null }; // fallback
    }

    // Build the answer array (for a single question)
    const answers = [{ level: levelVariant, isCorrect }];

    // Call the backend
    if (actors.quiz && actors.quiz.submitQuiz) {
      try {
        const reward = await actors.quiz.submitQuiz(answers);
        console.log('Reward received:', reward);
      } catch (e) {
        console.error('Error submitting quiz:', e);
      }
    }

    setIsCorrect(isCorrect);

    setTimeout(
      () => {
        nextQuestion();
      },
      isCorrect ? 2000 : 1000,
    );
  };

  const userTakeQuiz = async () => {
    if (!actors.quiz) return;
    await actors.quiz?.userTakeTheQuiz();
    // Fetch the updated energy
    const updatedEnergy = await actors.quiz?.getEnergy();
    setCurrentEnergy(Number(updatedEnergy));
    console.log('user energy; ', currentEnergy);
  };

  /**
   *
   * Instead this logic for decrement the userEnergy, why not,
   * Every submit. So once the users submit the energy will be deduct
   * Then in the submit will print the users answers if correct then what level
   *
   * OR
   *
   * Maybe I will create function to get the result, then will store to the backend
   * So i need to get how many wins, what levels so yeah!
   */

  return { handleAnswer, nextQuestion, isCorrect, currentQuestion, filteredQuestions, options };
};
