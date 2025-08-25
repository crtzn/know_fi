import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { useAuth } from '@/contexts/AuthContext';

const responseSchema = z.object({
  content: z.string().min(1, 'Content is required'),
});

type ResponseValues = z.infer<typeof responseSchema>;

export default function useResponsePost() {
  const { actors } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<ResponseValues>({
    resolver: zodResolver(responseSchema),
  });
  const [comments, setComments] = useState<ResponseValues[]>([]);

  const submitComment = async (
    postId: string,
    data: ResponseValues,
    onSuccess?: (newComment: { content: string }) => void,
  ) => {
    try {
      const response = await actors.forum.comment(BigInt(postId), data.content);
      const newComment = { content: data.content };
      setComments((prevComments) => [...prevComments, newComment]);
      toast.success('Your comment has been posted!');

      // Trigger the callback to update the parent component's state
      if (onSuccess) {
        onSuccess(newComment);
      }

      reset();
    } catch (error) {
      toast.error('Error submitting comment. Please try again.');
      console.error('Error submitting comment:', error);
    }
  };

  return {
    register,
    handleSubmit,
    isSubmitting,
    errors,
    submitComment,
    comments,
  };
}
