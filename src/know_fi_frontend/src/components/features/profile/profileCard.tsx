import { Copy } from 'lucide-react';

import profileImg from '@/components/common/icons/sampleNft.png';
import bannerImg from '@/components/common/profile-background/prof-bg.png';
import { Card } from '@/components/ui/card';
import { UserProfile } from '@/hooks/userProfile';

export function ProfileCard() {
  const { userProfile } = UserProfile();
  return (
    <Card className="overflow-hidden border-2 border-b-4 border-r-4 border-black">
      {/* Banner */}
      <div className="relative h-40 w-full">
        <img src={bannerImg.src} alt="Banner" className="size-full object-cover" />
      </div>

      {/* Profile Section */}
      <div className="relative bg-gray-500 px-4 pb-4">
        {/* Profile Picture */}
        <div className="absolute -top-12 left-4 size-24 overflow-hidden rounded-full border-4 border-purple-500">
          <img src={profileImg.src} alt="Profile" className="size-24 rounded-full object-cover" />
        </div>

        {/* Info + Edit */}

        <div className="flex items-center justify-between pt-14">
          <div>
            <h2 className="text-lg font-bold">{userProfile?.name}</h2>
            <p className="">@{userProfile?.userName}</p>
          </div>

          {/* Principal ID - Top Right */}
          <div className="absolute right-4 top-4 flex gap-2">
            <p className="text-sm text-black">Principal ID: xy123-qwrt4-fg234q-qes456-tffy</p>
            <button className="text-blacktransition-colors hover:text-white">
              <Copy size={16} />
            </button>
          </div>
          <button className="rounded-lg border border-black bg-orange-500 px-4 py-1 text-sm font-semibold text-black hover:bg-black hover:text-orange-500">
            Edit Profile
          </button>
        </div>
      </div>
    </Card>
  );
}
