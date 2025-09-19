'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export function CreateStep1({
  open,
  onOpenChange,
  onNext,
  creatorData,
  setCreatorData,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNext: () => void;
  creatorData: { fullName: string; linkedin: string; github: string; website: string };
  setCreatorData: React.Dispatch<React.SetStateAction<any>>;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">I. Creator Fill up Form</DialogTitle>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onNext(); // 👈 go to step 2
          }}
        >
          {/* Name */}
          <div className="space-y-1">
            <Label htmlFor="name">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Full Name"
              required
              value={creatorData.fullName}
              onChange={(e) => setCreatorData({ ...creatorData, fullName: e.target.value })}
            />
          </div>

          {/* LinkedIn */}
          <div className="space-y-1">
            <Label htmlFor="linkedin">
              LinkedIn <span className="text-red-500">*</span>
            </Label>
            <Input
              id="linkedin"
              placeholder="LinkedIn"
              required
              value={creatorData.linkedin}
              onChange={(e) => setCreatorData({ ...creatorData, linkedin: e.target.value })}
            />
          </div>

          {/* Github */}
          <div className="space-y-1">
            <Label htmlFor="github">
              Github <span className="text-red-500">*</span>
            </Label>
            <Input
              id="github"
              placeholder="Github"
              required
              value={creatorData.github}
              onChange={(e) => setCreatorData({ ...creatorData, github: e.target.value })}
            />
          </div>

          {/* Website */}
          <div className="space-y-1">
            <Label htmlFor="website">
              Website <span className="text-red-500">*</span>
            </Label>
            <Input
              id="website"
              placeholder="Website Portfolio"
              required
              value={creatorData.website}
              onChange={(e) => setCreatorData({ ...creatorData, website: e.target.value })}
            />
          </div>

          {/* Separator */}
          <Separator className="my-4" />

          {/* Button */}
          <div className="flex justify-end pt-4">
            <Button type="submit" className="rounded-md border-2 border-black bg-white text-black hover:bg-gray-100">
              Next
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
