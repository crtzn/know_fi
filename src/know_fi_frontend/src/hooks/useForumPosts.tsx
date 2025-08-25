import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { useAuth } from '@/contexts/AuthContext';

const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
});

type PostFormValues = z.infer<typeof postSchema>;

export default function useForumPosts() {
  const { actors } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
  });

  const onSubmit = async (data: PostFormValues) => {
    try {
      await actors.forum.createPost(data.title, data.content);
      console.log('Post submitted:', data);
      toast('Success', {
        description: 'Your post has been posted',
      });
      reset();
    } catch (error) {
      console.error('Error submitting post:', error);
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isSubmitting,
  };
}
