// here define the profile of the user
/**
 * fetch the categories users choose, will be used to display for
 * quiz categories pick
 */

import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '@/hooks/useAuth';

export const UserProfile = () => {
  const { actor } = useAuth();
  const [categories, setCategories] = useState<string[]>([]);
  const [energy, setEnergy] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUserEnergy();
  }, [actor]);

  const getUserCategories = useCallback(async () => {
    const categories = await actor?.getCategories();
    if (Array.isArray(categories) && Array.isArray(categories[0] || [])) {
      setCategories(categories[0]);
    } else {
      setCategories([]);
    }
  }, [actor]);

  const getUserEnergy = useCallback(async () => {
    setLoading(true);
    const energy = await actor?.getEnergy();
    setEnergy(energy);
    setLoading(false);
  }, [actor]);

  return { energy, categories, getUserCategories, getUserEnergy, loading };
};
