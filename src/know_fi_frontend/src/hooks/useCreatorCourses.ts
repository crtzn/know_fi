import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '@/contexts/AuthContext';
import type { Course } from '@/types/course';

import type { CourseCategory, CourseDifficulty, CourseStatus } from '../../../declarations/courses/courses.did';

interface UseCreatorCoursesReturn {
  courses: Course[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useCreatorCourses = (): UseCreatorCoursesReturn => {
  const { actors, userPrincipal, isAuthenticated } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    if (!isAuthenticated || !userPrincipal || !actors?.courses) {
      setCourses([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await actors.courses.getCoursesByCreator(userPrincipal);

      // Transform the backend data to match our frontend types
      const transformedCourses: Course[] = result.map((course) => ({
        id: Number(course.id),
        title: course.title,
        description: course.description,
        category: transformCategory(course.category),
        difficulty: transformDifficulty(course.difficulty),
        thumbnail_url: course.thumbnail_url && course.thumbnail_url.length > 0 ? course.thumbnail_url[0] : undefined,
        creator: {
          principal_id: course.creator.principal_id.toString(),
          name: course.creator.name,
          bio: course.creator.bio && course.creator.bio.length > 0 ? course.creator.bio[0] : undefined,
          linkedin:
            course.creator.linkedin && course.creator.linkedin.length > 0 ? course.creator.linkedin[0] : undefined,
          github: course.creator.github && course.creator.github.length > 0 ? course.creator.github[0] : undefined,
          website: course.creator.website && course.creator.website.length > 0 ? course.creator.website[0] : undefined,
          expertise: [], // Not available in backend, set as empty array
        },
        content: {
          sections:
            course.content.sections?.map((section: any) => ({
              id: Number(section.id),
              title: section.title,
              description: section.description || '',
              order: Number(section.order),
              lectures:
                section.lessons?.map((lesson: any) => ({
                  id: Number(lesson.id),
                  title: lesson.title,
                  description: lesson.description || '',
                  video_url: lesson.content_url?.[0] || undefined,
                  duration_minutes: Number(lesson.duration_minutes?.[0]) || 10,
                  order: Number(lesson.order),
                })) || [],
            })) || [],
          total_duration_minutes: Number(course.content.estimated_duration_hours) * 60,
          total_lectures:
            course.content.sections?.reduce(
              (total: number, section: any) => total + (section.lessons?.length || 0),
              0,
            ) || 0,
        },
        token_reward: Number(course.token_reward),
        price_tokens: Number(course.price_tokens),
        status: transformStatus(course.status),
        created_at: Number(course.created_at),
        updated_at: Number(course.updated_at),
        approved_at: course.approved_at && course.approved_at.length > 0 ? Number(course.approved_at[0]) : undefined,
        approved_by: course.approved_by && course.approved_by.length > 0 ? course.approved_by[0].toString() : undefined,
        tags: course.tags,
        student_count: Number(course.student_count),
        rating: Number(course.rating),
        review_count: Number(course.review_count),
      }));

      setCourses(transformedCourses);
    } catch (err) {
      console.error('Error fetching creator courses:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch courses');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, userPrincipal, actors?.courses]);

  // Transform Motoko variant to string
  const transformStatus = (status: CourseStatus): 'pending' | 'approved' | 'rejected' => {
    if (typeof status === 'object') {
      if ('pending' in status) return 'pending';
      if ('approved' in status) return 'approved';
      if ('rejected' in status) return 'rejected';
    }
    return 'pending'; // fallback
  };

  // Transform category variant to string
  const transformCategory = (category: CourseCategory): string => {
    if (typeof category === 'object') {
      const key = Object.keys(category)[0];
      return key || 'other';
    }
    return 'other';
  };

  // Transform difficulty variant to string
  const transformDifficulty = (difficulty: CourseDifficulty): string => {
    if (typeof difficulty === 'object') {
      const key = Object.keys(difficulty)[0];
      return key || 'beginner';
    }
    return 'beginner';
  };

  // Auto-fetch when authentication state changes
  useEffect(() => {
    if (isAuthenticated && userPrincipal) {
      fetchCourses();
    }
  }, [fetchCourses, isAuthenticated, userPrincipal]);

  // Auto-refresh when page becomes visible again (user returns from course creation)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isAuthenticated && userPrincipal) {
        fetchCourses();
      }
    };

    const handleFocus = () => {
      if (isAuthenticated && userPrincipal) {
        fetchCourses();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchCourses, isAuthenticated, userPrincipal]);

  return {
    courses,
    isLoading,
    error,
    refetch: fetchCourses,
  };
};
