'use client';

import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

export function CreateStep4({
  open,
  onOpenChange,
  onBack,
  creatorData,
  courseData,
  sectionsData,
  actors,
  mode = 'new',
  selectedCourseId,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBack: () => void;
  creatorData: { fullName: string; linkedin: string; github: string; website: string };
  courseData?: any;
  sectionsData?: any;
  actors?: any;
  mode?: 'new' | 'existing' | null;
  selectedCourseId?: number | null;
  onSubmit: () => void;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // Check if we have the actors available
      if (!actors?.courses) {
        console.log('No actors available, saving to localStorage only');
        localStorage.setItem('hasData', 'true');
        onSubmit();
        onOpenChange(false);
        router.push('/creates');
        return;
      }

      if (mode === 'existing') {
        // Handle adding sections to existing course
        if (!selectedCourseId) {
          throw new Error('No course selected for adding modules');
        }

        // Filter only new sections (not existing ones) - existing sections have isExisting = true
        const newSections = sectionsData?.filter((section: any) => !section.isExisting) || [];

        console.log('Original sectionsData:', sectionsData);
        console.log('Filtered newSections:', newSections);
        console.log(
          'Raw sections data:',
          newSections.map((s) => ({
            title: s.title,
            lectures: s.lectures?.map((l: any) => ({
              title: l.title,
              videoUrl: l.videoUrl,
              description: l.description,
            })),
          })),
        );

        if (newSections.length === 0) {
          throw new Error('No new modules to add');
        }

        // Convert frontend sections to backend Section format
        const backendSections = newSections.map((section: any, sectionIndex: number) => ({
          id: BigInt(sectionIndex), // Backend will reassign proper IDs
          title: section.title || `Section ${sectionIndex + 1}`,
          description: section.description || section.title || 'No description provided',
          order: BigInt(sectionIndex),
          status: { pending: null }, // New sections start as pending
          added_at: [BigInt(Date.now() * 1000000)], // Current timestamp in nanoseconds
          approved_at: [],
          approved_by: [],
          lessons:
            section.lectures?.map((lecture: any, lectureIndex: number) => ({
              id: BigInt(lectureIndex),
              title: lecture.title || 'Untitled Lesson',
              description: lecture.description || 'No description provided',
              content_type: 'video',
              content_url: lecture.videoUrl ? [lecture.videoUrl] : ['https://www.youtube.com/watch?v=example'],
              content_text: [],
              duration_minutes: [BigInt(30)], // Default duration
              order: BigInt(lectureIndex),
            })) || [],
        }));

        console.log('Adding sections to course:', selectedCourseId, 'New sections:', backendSections);

        // Call addSectionsToExistingCourse
        const result = await actors.courses.addSectionsToExistingCourse(BigInt(selectedCourseId), backendSections);

        if ('ok' in result) {
          console.log('Sections added successfully to course:', selectedCourseId);
          localStorage.setItem('hasData', 'true');
          onSubmit();
          onOpenChange(false);
          router.push('/creates');
        } else {
          throw new Error(result.err);
        }
      } else {
        // Handle creating new course (original logic)
        const courseSubmission = {
          title: courseData?.title || 'Sample Course',
          description: courseData?.description || 'Course description',
          category: { [courseData?.category || 'programming']: null },
          difficulty: { [courseData?.difficulty || 'beginner']: null },
          thumbnail_url: courseData?.thumbnail ? [courseData.thumbnail] : [],
          creator_info: {
            name: creatorData.fullName,
            bio: [],
            linkedin: creatorData.linkedin ? [creatorData.linkedin] : [],
            github: creatorData.github ? [creatorData.github] : [],
            website: creatorData.website ? [creatorData.website] : [],
            portfolio: [],
          },
          content: {
            introduction: courseData?.hook || 'Course introduction',
            learning_objectives: ['Learn the fundamentals'],
            prerequisites: [],
            sections: sectionsData?.map((section: any, sectionIndex: number) => ({
              id: BigInt(sectionIndex),
              title: section.title || `Section ${sectionIndex + 1}`,
              description: section.description || section.title || 'Course introduction section',
              order: BigInt(sectionIndex),
              status: { approved: null }, // New courses start as approved for original sections
              added_at: [],
              approved_at: [],
              approved_by: [],
              lessons:
                section.lectures?.map((lecture: any, lectureIndex: number) => ({
                  id: BigInt(lectureIndex),
                  title: lecture.title || 'Introduction Lesson',
                  description: lecture.description || 'Course introduction lesson',
                  content_type: 'video',
                  content_url: lecture.videoUrl ? [lecture.videoUrl] : ['https://www.youtube.com/watch?v=example'],
                  content_text: [],
                  duration_minutes: [BigInt(lecture.duration || 30)],
                  order: BigInt(lectureIndex),
                })) || [],
            })) || [
              {
                id: BigInt(0),
                title: 'Introduction Section',
                description: 'Course introduction section',
                order: BigInt(0),
                status: { approved: null },
                added_at: [],
                approved_at: [],
                approved_by: [],
                lessons: [
                  {
                    id: BigInt(0),
                    title: 'Introduction Lesson',
                    description: 'Course introduction lesson',
                    content_type: 'video',
                    content_url: ['https://www.youtube.com/watch?v=example'],
                    content_text: [],
                    duration_minutes: [BigInt(30)],
                    order: BigInt(0),
                  },
                ],
              },
            ],
            estimated_duration_hours: BigInt(2),
          },
          token_reward: BigInt(courseData?.tokenReward || 100),
          price_tokens: BigInt(courseData?.priceTokens || 200),
          tags: courseData?.tags || ['sample'],
        };

        console.log('Submitting new course:', courseSubmission);

        // Call the backend
        const result = await actors.courses.createCourse(courseSubmission);

        if ('ok' in result) {
          console.log('Course created successfully with ID:', result.ok);
          localStorage.setItem('hasData', 'true');
          onSubmit();
          onOpenChange(false);
          router.push('/creates');
        } else {
          throw new Error(result.err);
        }
      }
    } catch (error) {
      console.error('Error submitting:', error);

      // Check if it's an authentication/delegation error
      if (error instanceof Error && error.message.includes('delegation')) {
        setSubmitError('Your session has expired. Please refresh the page and log in again.');
      } else if (error instanceof Error && error.message.includes('AgentCallError')) {
        setSubmitError('Connection error. Please check your internet connection and try again.');
      } else {
        setSubmitError(error instanceof Error ? error.message : 'Failed to submit');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>IV. {mode === 'existing' ? 'Review and Add Modules' : 'Review and Submit'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* I. Creator's Form */}
          <div>
            <div className="flex items-center justify-between">
              <h2 className="font-bold">I. Creator&apos;s Form</h2>
              <button className="text-gray-600 hover:text-black">
                <Pencil size={16} />
              </button>
            </div>

            <div className="mt-2 rounded-md border bg-gray-100 p-3 text-sm text-gray-700">
              <p>
                <strong>Full Name:</strong> {creatorData.fullName}
              </p>
              <p>
                <strong>LinkedIn:</strong> {creatorData.linkedin}
              </p>
              <p>
                <strong>Github:</strong> {creatorData.github}
              </p>
              <p>
                <strong>Website:</strong> {creatorData.website}
              </p>
            </div>
          </div>

          {/* II. Start Course */}
          <div>
            <h2 className="font-bold">II. Course Details</h2>
            <div className="mt-2 rounded-md border bg-gray-100 p-3 text-sm text-gray-700">
              <p>
                <strong>Title:</strong> {courseData?.title || 'Not provided'}
              </p>
              <p>
                <strong>Category:</strong> {courseData?.category || 'Not selected'}
              </p>
              <p>
                <strong>Difficulty:</strong> {courseData?.difficulty || 'Not selected'}
              </p>
              <p>
                <strong>Description:</strong> {courseData?.description || 'No description provided'}
              </p>
            </div>
          </div>

          <Separator />

          {/* Error Display */}
          {submitError && (
            <div className="rounded-md border border-red-400 bg-red-50 p-4 text-red-700">
              <strong>Error:</strong> {submitError}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              type="button"
              className="rounded-md border-2 border-black bg-white text-black hover:bg-gray-100"
              onClick={onBack}
              disabled={isSubmitting}
            >
              Back
            </Button>
            <Button
              type="button"
              className="rounded-md border-2 border-black bg-white text-black hover:bg-gray-100"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : mode === 'existing' ? 'Add Modules' : 'Submit Course'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
