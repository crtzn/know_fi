import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { UserProfile } from '@/hooks/userProfile';

export default function CategoriesModal() {
  const { categories, getUserCategories } = UserProfile();

  /**
   * get categories choose to take quiz
   * parang mas okay if walang categories choose, rekta quiz na agad.
   */

  return (
    <div>
      <Dialog>
        <DialogTrigger onClick={getUserCategories}>Take Quiz</DialogTrigger>
        <DialogContent>
          <DialogHeader className="flex w-full items-center justify-center">
            <DialogTitle className="text-4xl">Choose Category</DialogTitle>
          </DialogHeader>

          <DialogDescription>
            {categories.map((category, index) => (
              <div key={index} className="flex flex-col gap-10 space-y-10">
                <h1 className="text-4xl">{category}</h1>
              </div>
            ))}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}
