'use client';

import { AuthClient } from '@dfinity/auth-client';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

import { createActor } from '../../../../declarations/know_fi_backend';
import { canisterId } from '../../../../declarations/know_fi_backend/index.js';

const network = process.env.DFX_NETWORK;
const identityProvider =
  network === 'ic'
    ? 'https://identity.ic0.app' // Mainnet
    : `http://${process.env.NEXT_PUBLIC_CANISTER_ID_INTERNET_IDENTITY}.localhost:4943/`; // Local

const Page = () => {
  const [state, setState] = useState({
    actor: undefined,
    authClient: undefined,
    isAuthenticated: false,
    principal: 'Click "Whoami" to see your principal ID',
  });

  // Initialize auth client
  useEffect(() => {
    updateActor();
  }, []);

  const updateActor = async () => {
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();
    const actor = createActor(canisterId, {
      agentOptions: {
        identity,
      },
    });
    const isAuthenticated = await authClient.isAuthenticated();

    setState((prev) => ({
      ...prev,
      actor,
      authClient,
      isAuthenticated,
    }));
  };

  const login = async () => {
    await state.authClient.login({
      identityProvider,
      onSuccess: updateActor,
    });
  };

  const logout = async () => {
    await state.authClient.logout();
    updateActor();
  };

  const whoami = async () => {
    setState((prev) => ({
      ...prev,
      principal: 'Loading...',
    }));

    const result = await state.actor.whoami();
    const principal = result.toString();
    setState((prev) => ({
      ...prev,
      principal,
    }));
  };

  return (
    <div>
      <div className="login-section container flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-4xl">
          Welcome to <span className="font-bold">KnowFi</span>
        </h1>
        <div className="mt-10">
          {!state.isAuthenticated ? (
            <Button className="size-10 w-80 bg-blue-500 hover:bg-blue-600" onClick={login}>
              Login with Internet Identity
            </Button>
          ) : (
            <Button className="size-10 w-full bg-red-500 hover:bg-red-600" onClick={logout}>
              Logout to Internet Identity
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
