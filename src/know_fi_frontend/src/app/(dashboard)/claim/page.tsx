'use client';

import React, { useState } from 'react';

import { useAuth } from '@/contexts/AuthContext';

export default function Page() {
  const { actors } = useAuth();
  const [badge, setBadge] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const claimBadge = async () => {
    try {
      const courseName = 'Sample Course'; // Replace with dynamic course name if needed
      const tokenId = await actors.nft.mintCourseCompletionCertificate(courseName);
      const allNFTs = await actors.nft.getAllNFTs();
      const mintedBadge = allNFTs.find(([id]) => id === tokenId);

      setBadge(mintedBadge);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error claiming badge:', error);
    }
  };

  const extractText = (value) => {
    return value?.Text || value;
  };

  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=I%20just%20earned%20a%20badge%20for%20completing%20a%20course!%20Check%20it%20out:%20${extractText(badge[1].metadata.find(([key]) => key === 'image')[1])}%20Credits%20to%20KnowFi%20for%20creating%20this%20platform!`;
    window.open(url, '_blank');
  };

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${extractText(badge[1].metadata.find(([key]) => key === 'image')[1])}`;
    window.open(url, '_blank');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f9f9f9' }}>
      <button
        onClick={claimBadge}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#4CAF50',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
        onMouseOver={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = '#45a049')}
        onMouseOut={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = '#4CAF50')}
      >
        Claim Badge
      </button>

      {isModalOpen && badge && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              maxWidth: '400px',
              textAlign: 'center',
            }}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
              }}
            >
              &times;
            </button>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <img
                src={extractText(badge[1].metadata.find(([key]) => key === 'image')[1])}
                alt="Badge"
                style={{ width: '100px', height: '100px', marginBottom: '10px' }}
              />
            </div>
            <h2 style={{ fontSize: '18px', margin: '10px 0' }}>
              {extractText(badge[1].metadata.find(([key]) => key === 'name')[1])}
            </h2>
            <p style={{ fontSize: '14px', color: '#555' }}>
              {extractText(badge[1].metadata.find(([key]) => key === 'description')[1])}
            </p>
            <div style={{ marginTop: '20px' }}>
              <button
                onClick={shareOnTwitter}
                style={{
                  padding: '10px 20px',
                  fontSize: '14px',
                  backgroundColor: '#1DA1F2',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  marginRight: '10px',
                }}
              >
                Share on Twitter
              </button>
              <button
                onClick={shareOnLinkedIn}
                style={{
                  padding: '10px 20px',
                  fontSize: '14px',
                  backgroundColor: '#0077B5',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                Share on LinkedIn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
