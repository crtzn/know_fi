'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
// import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form } from '@/components/ui/form';
import { Label } from '@/components/ui/label';

/**
 * Now the logic here is if new user need to choose categories navigate to push(/categories)
 * If old user navigate to push(/)
 * Then need to working for backend to save the categories choose of user using principal(idk i'm not sure)
 */

const categories = [
  { id: 1, name: 'Trading' },
  { id: 2, name: 'Programming' },
  { id: 3, name: 'Creatives' },
  { id: 4, name: 'Artificial Intelligence' },
];

const FormSchema = z.object({
  categories: z.array(z.string()).refine((value) => value.some((category) => category), {
    message: 'You have to select at least one category.',
  }),
});

function Page() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      categories: ['Trading', 'Programming'],
    },
  });

  const onSubmit = () => {
    return console.log('hello world!');
  };
  return (
    <div className="container min-h-screen">
      <div className="item-center m-auto flex min-h-screen w-full flex-col justify-center text-center">
        <div className="flex flex-col space-y-1">
          <h1 className="text-4xl font-medium">What Categories Are You Interested In?</h1>
          <p className="text-[1.2rem] text-gray-500">You can select multiple categories</p>
        </div>

        {/*Categories section */}

        <div className="mx-auto">
          <Form {...form}>
            <form action="">
              {categories.map((category) => (
                <Label key={category.id} className="item-center flex justify-center">
                  <div className="mt-5 flex w-[30vw] items-center justify-between gap-10 rounded-lg border-zinc-700 bg-[#D9D9D9] p-4 text-black">
                    <div className="item-center align-center flex">
                      {/* add icon here */}
                      <h1 className="text-2xl font-medium">{category.name}</h1>
                    </div>
                    <Checkbox />
                  </div>
                </Label>
              ))}
            </form>
          </Form>
          <div className="flex w-full justify-start text-gray-300">
            <p className="mt-2">More Categories upcoming soon...</p>
          </div>
          <div className="flex justify-end">
            <Button className="rounded-full bg-gray-400 p-6 text-2xl">Proceed</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
