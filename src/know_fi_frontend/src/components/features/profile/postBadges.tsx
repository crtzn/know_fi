import React, { useEffect, useState } from 'react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

export function PostBadges() {
  const { actors, userPrincipal } = useAuth();
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const userPrincipalBadges = await actors.nft.getNFTsOfUser(userPrincipal);
        const allNFTs = await actors.nft.getAllNFTs();
        const userBadges = allNFTs.filter(([id, { owner }]) => userPrincipalBadges.includes(id));
        setBadges(userBadges);
      } catch (error) {
        console.error('Error fetching badges:', error);
      }
    };

    fetchBadges();
  }, [actors, userPrincipal]);

  return (
    <div>
      <h1 className="mb-4 text-lg font-bold">My Badges</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {badges.map(([id, { metadata }]) => (
          <Card key={id} className="rounded-lg shadow-md">
            <CardHeader>
              <CardTitle>{metadata.find(([key]) => key === 'name')[1]?.Text || 'Badge'}</CardTitle>
              <CardDescription>
                {metadata.find(([key]) => key === 'description')[1]?.Text || 'Description'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <img
                src={metadata.find(([key]) => key === 'image')[1]?.Text || ''}
                alt="Badge"
                className="mx-auto size-16 rounded-md"
              />
            </CardContent>
            <CardFooter>
              <p>Badge ID: {id}</p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
