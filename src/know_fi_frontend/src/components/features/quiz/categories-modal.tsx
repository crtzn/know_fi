import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { UserProfile } from '@/hooks/userProfile';

interface CategoryFormData {
  selectedCategories: string[];
}

export default function CategoriesModal() {
  const { categories, getUserCategories } = UserProfile();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { actor } = useAuth();
  const route = useRouter();
  const handleCategoryClick = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    );
  };

  const handleSubmitCategories = async () => {
    if (!actor) return;
    // get selectedCategories, then will pass to the backend all selected categories
    await actor?.setUsersQuizCategories(selectedCategories);
    console.log('LIST OF SELECTED CATEGORIES TO TAKE THE QUIZ: ', selectedCategories);
    route.push('/quiz');
  };
  return (
    <div>
      <Dialog>
        <DialogTrigger onClick={getUserCategories}>Take Quiz</DialogTrigger>
        <DialogContent className="max-w-2xl" onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader className="flex w-full items-center justify-center">
            <DialogTitle className="text-4xl text-[#3C005E]">Choose Category</DialogTitle>
          </DialogHeader>

          <DialogDescription>
            <div className="item-center grid h-72 w-full grid-cols-2 justify-center gap-5 rounded-none bg-white align-middle">
              {categories ? (
                categories.map((category, index) => {
                  const isSelected = selectedCategories.includes(category);
                  return (
                    <Label
                      onClick={() => handleCategoryClick(category)}
                      key={index}
                      className={`flex cursor-pointer items-center justify-center border border-black align-middle text-2xl text-black transition-all duration-200 ${isSelected ? 'translate-x-1 translate-y-1 bg-[#65009F] text-white shadow-[2px_2px_0_rgba(0,0,0,1)]' : 'shadow-[4px_4px_0_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0_rgba(0,0,0,1)]'}`}
                    >
                      {category}
                    </Label>
                  );
                })
              ) : (
                <Label className="flex w-full items-center justify-center align-middle">No data found</Label>
              )}
            </div>
            <div className="mt-5 flex w-full justify-end gap-5">
              <DialogClose>
                <Button variant="outline" className="text-black">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="w-32" onClick={handleSubmitCategories}>
                Proceed
              </Button>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}
