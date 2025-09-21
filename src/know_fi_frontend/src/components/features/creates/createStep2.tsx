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
  courseData,
  setCourseData,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBack: () => void;
  onNext: () => void;
  courseData: {
    title: string;
    hook: string;
    description: string;
    category: string;
    difficulty: string;
    thumbnail: string;
    tags: string[];
    tokenReward: number;
    priceTokens: number;
  };
  setCourseData: React.Dispatch<React.SetStateAction<any>>;
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
            <Input
              id="title"
              placeholder="Course Title"
              required
              value={courseData.title}
              onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
            />
          </div>

          {/* Hook */}
          <div className="space-y-1">
            <Label htmlFor="hook">
              Hook <span className="text-red-500">*</span>
            </Label>
            <Input
              id="hook"
              placeholder="Your title here"
              required
              value={courseData.hook}
              onChange={(e) => setCourseData({ ...courseData, hook: e.target.value })}
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Course Description..."
              value={courseData.description}
              onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
            />
          </div>

          {/* Category + Difficulty */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="category">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select
                value={courseData.category}
                onValueChange={(value) => setCourseData({ ...courseData, category: value })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trading">Trading</SelectItem>
                  <SelectItem value="programming">Programming</SelectItem>
                  <SelectItem value="ai">Artificial Intelligence</SelectItem>
                  <SelectItem value="blockchain">Blockchain</SelectItem>
                  <SelectItem value="motoko">Motoko</SelectItem>
                  <SelectItem value="web3">Web3</SelectItem>
                  <SelectItem value="defi">DeFi</SelectItem>
                  <SelectItem value="nft">NFT</SelectItem>
                  <SelectItem value="icp">ICP</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="difficulty">
                Difficulty <span className="text-red-500">*</span>
              </Label>
              <Select
                value={courseData.difficulty}
                onValueChange={(value) => setCourseData({ ...courseData, difficulty: value })}
              >
                <SelectTrigger id="difficulty">
                  <SelectValue placeholder="Select Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
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
