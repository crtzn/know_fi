'use client';

import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

export function CreateStep4({
  open,
  onOpenChange,
  onBack,
  creatorData,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBack: () => void;
  creatorData: { fullName: string; linkedin: string; github: string; website: string };
  onSubmit: () => void;
}) {
  const router = useRouter();

  const handleSubmit = () => {
    // 🔹 Call parent handler (if needed)
    onSubmit();

    // 🔹 Close the dialog first
    onOpenChange(false);

    // 🔹 Save flag so page.tsx knows data exists
    localStorage.setItem('hasData', 'true');

    // 🔹 Redirect to creators page
    router.push('/creates');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>IV. Review and Submit</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* I. Creator's Form */}
          <div>
            <div className="flex items-center justify-between">
              <h2 className="font-bold">I. Creator&apos;s Form</h2>
              <button className="text-gray-600 hover:text-black">
                <Pencil size={16} />
              </button>
            </div>

            <div className="mt-2 rounded-md border bg-gray-100 p-3 text-sm text-gray-700">
              <p>
                <strong>Full Name:</strong> {creatorData.fullName}
              </p>
              <p>
                <strong>LinkedIn:</strong> {creatorData.linkedin}
              </p>
              <p>
                <strong>Github:</strong> {creatorData.github}
              </p>
              <p>
                <strong>Website:</strong> {creatorData.website}
              </p>
            </div>
          </div>

          {/* II. Start Course */}
          <div>
            <h2 className="font-bold">II. Start Course</h2>
            <div className="mt-2 min-h-[100px] rounded-md border bg-gray-100 p-3"></div>
          </div>

          <Separator />

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              type="button"
              className="rounded-md border-2 border-black bg-white text-black hover:bg-gray-100"
              onClick={onBack}
            >
              Back
            </Button>
            <Button
              type="button"
              className="rounded-md border-2 border-black bg-white text-black hover:bg-gray-100"
              onClick={handleSubmit} // ✅ redirect here
            >
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
