'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

export function CreateStep2({
  open,
  onOpenChange,
  onBack,
  onNext,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">II. Start Course</DialogTitle>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onNext(); // 👈 go to step 2
          }}
        >
          {/* Title */}
          <div className="space-y-1">
            <Label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input id="title" placeholder="" required />
          </div>

          {/* Hook */}
          <div className="space-y-1">
            <Label htmlFor="hook">
              Hook <span className="text-red-500">*</span>
            </Label>
            <Input id="hook" placeholder="Your title here" required />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Course Description..." />
          </div>

          {/* Category + Difficulty */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="category">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tech">Trading</SelectItem>
                  <SelectItem value="tech">Programming</SelectItem>
                  <SelectItem value="design">Creatives</SelectItem>
                  <SelectItem value="business">Artificial Intelligence</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="difficulty">
                Difficulty <span className="text-red-500">*</span>
              </Label>
              <Select>
                <SelectTrigger id="difficulty">
                  <SelectValue placeholder="Select Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Thumbnail Upload */}
          <div className="space-y-1">
            <Label>Add Thumbnail</Label>
            <div className="flex flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-400 p-6 text-sm text-gray-500">
              <span>
                📁 Drag and Drop or <span className="cursor-pointer text-blue-600">Click to Upload</span>
              </span>
              <span className="mt-1 text-xs">Supported Formats: JPEG, PNG, GIF. Max size: 5Mb</span>
            </div>
          </div>

          {/* Separator */}
          <Separator className="my-4" />

          {/* Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              type="button"
              className="rounded-md border-2 border-black bg-white text-black hover:bg-gray-100"
              onClick={onBack}
            >
              Back
            </Button>
            <Button type="submit" className="rounded-md border-2 border-black bg-white text-black hover:bg-gray-100">
              Next
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
