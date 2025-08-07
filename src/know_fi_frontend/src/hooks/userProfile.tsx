import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '@/hooks/useAuth';

export const UserProfile = () => {
  const { actors, userPrincipal } = useAuth();
  const [categories, setCategories] = useState<string[]>([]);
  const [currentEnergy, setCurrentEnergy] = useState<number>(0);
  const [userToken, setUserToken] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUserEnergy();
    getUserToken();
  }, [actors]);

  const getUserCategories = useCallback(async () => {
    const categories = await actors.quiz?.getCategories();
    if (Array.isArray(categories) && Array.isArray(categories[0] || [])) {
      setCategories(categories[0]);
    } else {
      setCategories([]);
    }
  }, [actors]);

  const getUserEnergy = useCallback(async () => {
    setLoading(true);
    const energy = await actors.quiz?.getEnergy();
    if (energy !== undefined) {
      setCurrentEnergy(Number(energy));
    }
    setLoading(false);
  }, [actors]);

  const getUserToken = useCallback(async () => {
    try {
      setLoading(true);
      const token = await actors.quiz?.getMyTokenBalance();
      setUserToken(Number(token));
    } catch (error) {
      console.error('Error fetching user token:', error);
      setUserToken(0);
    } finally {
      setLoading(false);
    }
  }, [actors, userPrincipal]);

  return { currentEnergy, setCurrentEnergy, userToken, categories, getUserCategories, getUserEnergy, loading };
};
