'use client';

import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

import { CourseSelectionStep } from './courseSelectionStep';
import { CreateStep1 } from './createStep1';
import { CreateStep2 } from './createStep2';
import { CreateStep3 } from './createStep3';
import { CreateStep4 } from './createStep4';

export function KnowCreatesContribute() {
  const [step, setStep] = useState<'select' | 1 | 2 | 3 | 4 | null>(null);
  const [mode, setMode] = useState<'new' | 'existing' | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const { actors } = useAuth();

  // Shared state across steps
  const [creatorData, setCreatorData] = useState({
    fullName: '',
    linkedin: '',
    github: '',
    website: '',
  });

  const [courseData, setCourseData] = useState({
    title: '',
    hook: '',
    description: '',
    category: '',
    difficulty: '',
    thumbnail: '',
    tags: [] as string[],
    tokenReward: 100,
    priceTokens: 200,
  });

  const [sectionsData, setSectionsData] = useState([
    {
      id: 1,
      title: 'Section 1: Introduction & Getting Started',
      lectures: [] as Array<{
        id: number;
        title: string;
        description: string;
        videoUrl: string;
      }>,
    },
  ]);

  const createsData = {
    heading: 'SHARE YOUR EXPERTISE, SHAPE THE FUTURE!',
    description:
      'KnowCreates is your platform to share your expertise and shape the future of decentralized education. Upload your high-quality courses and modules to help close the knowledge gap in Web3.',
  };

  // Function to load existing course modules
  const loadExistingCourseModules = async (courseId: number) => {
    try {
      if (!actors?.courses) {
        console.log('No actors available');
        setSectionsData([]);
        return;
      }

      // Get the course details by ID
      const courseResult = await actors.courses.getCourseById(BigInt(courseId));

      if (courseResult && courseResult.length > 0) {
        const course = courseResult[0];
        console.log('Loaded course:', course);

        // Transform sections to the UI format
        const existingSections =
          course.content.sections?.map((section: any) => ({
            id: Number(section.id),
            title: section.title,
            lectures:
              section.lessons?.map((lesson: any) => ({
                id: Number(lesson.id),
                title: lesson.title,
                description: lesson.description || '',
                videoUrl: lesson.content_url && lesson.content_url.length > 0 ? lesson.content_url[0] : '',
              })) || [],
          })) || [];

        console.log('Transformed existing sections:', existingSections);
        setSectionsData(existingSections);
      } else {
        console.log('Course not found or empty result');
        setSectionsData([]);
      }
    } catch (error) {
      console.error('Error loading course modules:', error);
      setSectionsData([]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6 text-center">
      {/* Heading */}
      <h1 className="text-6xl font-semibold italic">{createsData.heading}</h1>

      {/* Description */}
      <p className="max-w-4xl text-2xl text-gray-700">
        <span className="font-bold text-black">KnowCreates</span> {createsData.description.replace('KnowCreates', '')}
      </p>

      {/* Button */}
      <Button
        onClick={() => setStep('select')} // open Course Selection first
        className="rounded-md border-4 border-black bg-green-300 px-12 py-7 text-2xl font-bold text-black shadow-md hover:bg-green-400"
      >
        CONTRIBUTE
      </Button>

      {/* Course Selection Step */}
      <CourseSelectionStep
        open={step === 'select'}
        onOpenChange={(open) => setStep(open ? 'select' : null)}
        onCreateNew={() => {
          setMode('new');
          setSelectedCourseId(null);
          setStep(1); // Start with creator info for new course
        }}
        onAddToExisting={(courseId) => {
          setMode('existing');
          setSelectedCourseId(courseId);
          // Load existing course modules instead of clearing
          loadExistingCourseModules(courseId);
          setStep(3); // Skip to content creation for existing course
        }}
      />

      {/* Step 1 - Only for new courses */}
      {mode === 'new' && (
        <CreateStep1
          open={step === 1}
          onOpenChange={(open) => setStep(open ? 1 : null)}
          onNext={() => setStep(2)} // go to Step 2
          creatorData={creatorData}
          setCreatorData={setCreatorData} // ✅ pass state
        />
      )}

      {/* Step 2 - Only for new courses */}
      {mode === 'new' && (
        <CreateStep2
          open={step === 2}
          onOpenChange={(open) => setStep(open ? 2 : null)}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
          courseData={courseData}
          setCourseData={setCourseData}
        />
      )}

      {/* Step 3 - For both new and existing courses */}
      <CreateStep3
        open={step === 3}
        onOpenChange={(open) => setStep(open ? 3 : null)}
        onBack={() => (mode === 'new' ? setStep(2) : setStep('select'))}
        onNext={() => setStep(4)}
        sectionsData={sectionsData}
        setSectionsData={setSectionsData}
        mode={mode}
        selectedCourseId={selectedCourseId}
      />

      {/* Step 4 - For both new and existing courses */}
      <CreateStep4
        open={step === 4}
        onOpenChange={(open) => setStep(open ? 4 : null)}
        onBack={() => setStep(3)}
        creatorData={creatorData}
        courseData={courseData}
        sectionsData={sectionsData}
        actors={actors}
        mode={mode}
        selectedCourseId={selectedCourseId}
        onSubmit={() => {
          console.log('Submitting course data:', {
            mode,
            selectedCourseId,
            creatorData,
            courseData,
            sectionsData,
          });
          setStep(null);
          setMode(null);
          setSelectedCourseId(null);
        }}
      />
    </div>
  );
}
