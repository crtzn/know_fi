'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileFormData, ProfileFormSchema } from '@/providers/lib/schema/profile';

function SetupProfile() {
  const { actors } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isLoading, errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(ProfileFormSchema),
  });

  const onSubmit = async (data: ProfileFormData) => {
    const profileData = {
      name: data.name,
      userName: data.userName,
      bio: data.bio,
      github: data.github,
      twitter: data.twitter,
      linkedin: data.linkedin,
    };

    await actors.profile.setProfile(profileData);

    reset();
  };
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="flex w-80 flex-col gap-5">
        <input {...register('name')} type="text" placeholder="name" className="h-10 p-2" />
        {errors.name && <p className="text-xs text-red-500">{`${errors.name.message}`}</p>}
        <input {...register('userName')} type="text" placeholder="userName" className="h-10 p-2" />
        {errors.userName && <p className="text-xs text-red-500">{`${errors.userName.message}`}</p>}
        <input {...register('bio')} type="text" placeholder="bio" className="h-10 p-2" />
        {errors.bio && <p className="text-xs text-red-500">{`${errors.bio.message}`}</p>}
        <input {...register('github')} placeholder="github" className="h-10 p-2" />
        {errors.github && <p className="text-xs text-red-500">{`${errors.github.message}`}</p>}
        <input {...register('twitter')} placeholder="twitter" className="h-10 p-2" />
        {errors.twitter && <p className="text-xs text-red-500">{`${errors.twitter.message}`}</p>}
        <input {...register('linkedin')} placeholder="linkedin" className="h-10 p-2" />
        {errors.linkedin && <p className="text-xs text-red-500">{`${errors.linkedin.message}`}</p>}
        <Button disabled={isSubmitting} type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
}

export default SetupProfile;
