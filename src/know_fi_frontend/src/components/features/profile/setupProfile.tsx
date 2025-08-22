'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileFormData, ProfileFormSchema } from '@/providers/lib/schema/profile';

function SetupProfile() {
  const route = useRouter();
  const { actors } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    formState: { isLoading, errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(ProfileFormSchema),
  });

  const steps = [
    { field: 'name', label: "What's your name?", placeholder: 'Enter your full name', required: true },
    { field: 'userName', label: 'Choose a username', placeholder: 'Enter your username', required: true },
    { field: 'bio', label: 'Tell us about yourself', placeholder: 'Write a short bio (optional)', required: false },
    { field: 'github', label: 'GitHub Profile', placeholder: 'GitHub username (optional)', required: false },
    { field: 'twitter', label: 'Twitter Profile', placeholder: 'Twitter username (optional)', required: false },
    { field: 'linkedin', label: 'LinkedIn Profile', placeholder: 'LinkedIn username (optional)', required: false },
  ];

  const onSubmit = async (data: ProfileFormData) => {
    const profileData = {
      name: data.name,
      userName: data.userName,
      bio: data.bio,
      github: data.github,
      twitter: data.twitter,
      linkedin: data.linkedin,
    };
    // Save the profile data
    await actors.profile.setProfile(profileData);

    // Check if categories are set
    const categories = await actors.quiz.getCategories();
    if (!categories || Object.values(categories).length === 0) {
      route.push('/categories'); // Redirect to categories setup
    } else {
      route.push('/'); // Redirect to home or another page
    }

    reset();
  };

  const handleNext = async () => {
    const currentField = steps[currentStep].field as keyof ProfileFormData;
    const isValid = await trigger(currentField);

    if (isValid || !steps[currentStep].required) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSkip = () => {
    if (!steps[currentStep].required) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSave = async () => {
    handleSubmit(onSubmit)();
  };

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="mx-auto w-full max-w-md p-8">
        {/* Form Container */}
        <div className="space-y-6">
          {/* Animated Step Container */}
          <div key={currentStep} className="transition-all duration-500 ease-out">
            <div className="mb-6 text-center">
              <h2 className="mb-2 text-2xl font-bold text-gray-900">{currentStepData.label}</h2>
              {!currentStepData.required && <p className="text-sm text-gray-500">This field is optional</p>}
            </div>

            <div className="space-y-3">
              <input
                {...register(currentStepData.field as keyof ProfileFormData)}
                type="text"
                placeholder={currentStepData.placeholder}
                className="h-12 w-full rounded-lg border-2 border-gray-200 px-4 text-lg transition-colors duration-200 focus:border-blue-500 focus:outline-none"
                autoFocus
              />

              {errors[currentStepData.field as keyof ProfileFormData] && (
                <p className="text-sm text-red-500 transition-all duration-300">
                  {String(errors[currentStepData.field as keyof ProfileFormData]?.message)}
                </p>
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-6">
            {/* Back Button */}
            {currentStep > 0 && (
              <Button type="button" variant="outline" onClick={handleBack} className="flex items-center gap-2">
                <ChevronLeft className="size-4" />
                Back
              </Button>
            )}

            {/* Skip Button (for optional fields) */}
            {!currentStepData.required && !isLastStep && (
              <Button type="button" variant="ghost" onClick={handleSkip} className="ml-auto flex items-center gap-2">
                Skip
              </Button>
            )}

            {/* Next/Save Button */}
            {isLastStep ? (
              <Button
                type="button"
                onClick={handleSave}
                disabled={isSubmitting}
                className="ml-auto bg-green-600 px-8 text-white hover:bg-green-700"
              >
                {isSubmitting ? 'Saving...' : 'Save Profile'}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleNext}
                className="ml-auto flex items-center gap-2 bg-[#65009F] text-white hover:bg-[#3C005E]"
              >
                Next
                <ChevronRight className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SetupProfile;
