import { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';
import { useCallback, useEffect, useState } from 'react';

// Import the generated actor creators and canister IDs for each canister
import { canisterId as authCanisterId, createActor as createAuthActor } from '../../../declarations/auth';
import { createActor as createProfileActor, canisterId as profileCanisterId } from '../../../declarations/profile';
import { createActor as createQuizActor, canisterId as quizCanisterId } from '../../../declarations/quiz';

const network = process.env.NEXT_PUBLIC_DFX_NETWORK;
const identityProvider =
  network === 'ic'
    ? 'https://identity.ic0.app'
    : `http://${process.env.NEXT_PUBLIC_CANISTER_ID_INTERNET_IDENTITY}.localhost:4943/`; // Local

const isLocal = process.env.DFX_NETWORK !== 'ic';
const host = isLocal ? 'http://localhost:4943' : 'https://icp0.io';

type Actors = {
  auth: ReturnType<typeof createAuthActor>;
  quiz: ReturnType<typeof createQuizActor>;
  profile: ReturnType<typeof createProfileActor>;
};

export const useAuth = () => {
  const [actors, setActors] = useState<Actors | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authClient, setAuthClient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userPrincipal, setUserPrincipal] = useState<Principal | null>(null);

  const updateActors = useCallback(async () => {
    setIsLoading(true);
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();

    setUserPrincipal(identity.getPrincipal());

    // Create an actor for each canister using the same identity and host
    const authActor = createAuthActor(authCanisterId, { agentOptions: { identity, host } });
    const quizActor = createQuizActor(quizCanisterId, { agentOptions: { identity, host } });
    const profileActor = createProfileActor(profileCanisterId, { agentOptions: { identity, host } });

    setActors({
      auth: authActor,
      quiz: quizActor,
      profile: profileActor,
    });

    setIsAuthenticated(await authClient.isAuthenticated());
    setAuthClient(authClient);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    updateActors();
  }, [updateActors]);

  const login = async () => {
    if (!authClient) return;
    await authClient.login({
      identityProvider,
      onSuccess: updateActors,
    });
  };

  const logout = async () => {
    if (!authClient) return;
    await authClient.logout();
    updateActors();
  };

  return { login, logout, isLoading, isAuthenticated, authClient, actors, userPrincipal };
};
