import { AuthClient } from '@dfinity/auth-client';
import { useCallback, useEffect, useState } from 'react';

import { createActor } from '../../../declarations/know_fi_backend';
import { canisterId } from '../../../declarations/know_fi_backend/index.js';

const network = process.env.DFX_NETWORK;
const identityProvider =
  network === 'ic'
    ? 'https://identity.ic0.app'
    : `http://${process.env.NEXT_PUBLIC_CANISTER_ID_INTERNET_IDENTITY}.localhost:4943/`; // Local

export const useAuth = () => {
  const [actor, setActor] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authClient, setAuthClient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const updateActor = useCallback(async () => {
    setIsLoading(true);
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();
    const actorInstance = createActor(canisterId, {
      agentOptions: {
        identity,
      },
    });

    const authenticated = await authClient.isAuthenticated();
    setAuthClient(authClient);
    setActor(actorInstance);
    setIsAuthenticated(authenticated);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    updateActor();
  }, [updateActor]);

  const login = async () => {
    if (!authClient) return;
    await authClient.login({
      identityProvider,
      onSuccess: updateActor,
    });
  };

  const logout = async () => {
    if (!authClient) return;
    await authClient.logout();
    updateActor();
  };

  return { login, logout, isLoading, isAuthenticated, authClient, actor };
};
