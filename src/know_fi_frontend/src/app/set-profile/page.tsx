'use client';

import React, { useEffect } from 'react';

import SetupProfile from '@/components/features/profile/setupProfile';
import { useAuth } from '@/contexts/AuthContext';

export default function Page() {
  const { actors } = useAuth();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const result = await actors.profile.getProfile();
    console.log(result);
  };
  return (
    <div>
      <SetupProfile />
    </div>
  );
}
