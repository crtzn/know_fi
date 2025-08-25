'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import useForumPosts from '@/hooks/useForumPosts';

interface PostDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function PostDialog({ open, onClose, onSuccess }: PostDialogProps) {
  const { register, handleSubmit, onSubmit, errors, isSubmitting } = useForumPosts();

  const handleFormSubmit = async (data: any) => {
    await onSubmit(data);
    if (onSuccess) {
      onSuccess();
    }
    onClose(); // Automatically close the modal after submission
  };

  useEffect(() => {
    handleSubmit;
  }, []);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div>
            <Label className="">Title</Label>
            <Input {...register('title')} placeholder="title" />
            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
          </div>
          <div className="mt-5">
            <Label>Content</Label>
            <Textarea {...register('content')} placeholder="Type your message here!" />
            {errors.content && <p className="text-sm text-red-500">{errors.content.message}</p>}
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting} className="mt-5">
              {isSubmitting ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
