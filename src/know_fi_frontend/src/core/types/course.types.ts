export type CourseCategory =
  | 'motoko'
  | 'icp'
  | 'blockchain'
  | 'trading'
  | 'ai'
  | 'defi'
  | 'nft'
  | 'web3'
  | 'programming'
  | 'other';

export type CourseDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type CourseStatus = 'draft' | 'submitted' | 'in_review' | 'approved' | 'rejected' | 'archived';

export interface Creator {
  name: string;
  bio: string;
  linkedin?: string;
  github?: string;
  website?: string;
  portfolio?: string;
}

export interface Lesson {
  title: string;
  content: string;
  video_url?: string;
  estimated_duration_minutes: number;
}

export interface CourseContent {
  introduction: string;
  learning_objectives: string[];
  prerequisites: string[];
  lessons: Lesson[];
  estimated_duration_hours: number;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  category: CourseCategory;
  difficulty: CourseDifficulty;
  creator: Creator;
  content: CourseContent;
  token_reward: number;
  price_tokens: number;
  status: CourseStatus;
  created_at: string;
  updated_at: string;
  thumbnail_url?: string;
  tags: string[];
  student_count: number;
  rating: number;
  review_count: number;
}
