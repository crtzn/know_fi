export type CourseStatus = 'pending' | 'approved' | 'rejected';

export interface CourseCreator {
  principal_id: string;
  name: string;
  bio?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  expertise: string[];
}

export interface CourseLecture {
  id: number;
  title: string;
  description: string;
  video_url?: string;
  duration_minutes: number;
  order: number;
}

export interface CourseSection {
  id: number;
  title: string;
  description: string;
  lectures: CourseLecture[];
  order: number;
}

export interface CourseContent {
  sections: CourseSection[];
  total_duration_minutes: number;
  total_lectures: number;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  thumbnail_url?: string;
  creator: CourseCreator;
  content: CourseContent;
  token_reward: number;
  price_tokens: number;
  status: CourseStatus;
  created_at: number;
  updated_at: number;
  approved_at?: number;
  approved_by?: string;
  tags: string[];
  student_count: number;
  rating: number;
  review_count: number;
}

export interface CreatorCourse {
  id: number;
  title: string;
  description: string;
  status: CourseStatus;
  rating: number;
  token_reward: number;
  student_count: number;
  created_at: number;
  approved_at?: number;
}
