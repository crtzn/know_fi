import { useEffect, useState } from 'react';

import { useAuth } from '@/hooks/useAuth';

export function useDailyClaim() {
  const { actors } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [claimStatus, setClaimStatus] = useState<'unclaimed' | 'claimed' | 'error'>('unclaimed');
  const [timeRemaining, setTimeRemaining] = useState('');
  const [canClaim, setCanClaim] = useState(true);

  // Check if user can claim (based on stored timestamp)
  useEffect(() => {
    const checkClaimEligibility = () => {
      const lastClaimTime = localStorage.getItem('lastDailyClaim');

      if (!lastClaimTime) {
        setCanClaim(true);
        return;
      }

      const lastClaim = parseInt(lastClaimTime, 10);
      const now = Date.now();
      const timeElapsed = now - lastClaim;
      const oneDayInMs = 24 * 60 * 60 * 1000;

      if (timeElapsed >= oneDayInMs) {
        setCanClaim(true);
        setClaimStatus('unclaimed');
      } else {
        setCanClaim(false);
        updateCountdown(lastClaim + oneDayInMs);
      }
    };

    checkClaimEligibility();

    // Check periodically
    const interval = setInterval(checkClaimEligibility, 60000);
    return () => clearInterval(interval);
  }, []);

  // The updateCountdown function is needed to:
  // 1. Calculate the time left until next claim
  // 2. Format it as HH:MM:SS
  // 3. Update the countdown timer each second
  const updateCountdown = (nextClaimTime: number) => {
    const updateTimer = () => {
      const now = Date.now();
      const remaining = nextClaimTime - now;

      if (remaining <= 0) {
        setCanClaim(true);
        setClaimStatus('unclaimed');
        setTimeRemaining('');
        return clearInterval(timer);
      }

      // Format remaining time
      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

      setTimeRemaining(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
      );
    };

    // Update immediately and then every second
    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return timer;
  };

  const claimDaily = async () => {
    if (!canClaim) return false;

    setIsLoading(true);
    try {
      await actors.quest.dailyClaim();

      // Save current timestamp for tracking the next claim time
      localStorage.setItem('lastDailyClaim', Date.now().toString());

      setClaimStatus('claimed');
      setCanClaim(false);

      // Start countdown for next claim
      const nextClaimTime = Date.now() + 24 * 60 * 60 * 1000;
      updateCountdown(nextClaimTime);

      return true;
    } catch (error) {
      console.error('Failed to claim daily reward:', error);
      setClaimStatus('error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { claimDaily, isLoading, claimStatus, canClaim, timeRemaining };
}
