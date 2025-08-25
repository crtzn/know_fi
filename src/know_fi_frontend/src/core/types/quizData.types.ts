export interface QuizData {
  question: string;
  options: string[];
  correct_answer: string;
  difficulty: string; // Updated from 'difficult' to 'difficulty'
  token_reward: number;
  category: string;
}
