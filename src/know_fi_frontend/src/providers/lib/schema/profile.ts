import { z } from 'zod';

export const ProfileFormSchema = z.object({
  name: z.string().min(3, 'Username must be at least 3 characters').max(24, 'Username must be at most 24 characters'),
  userName: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(12, 'Username must be at most 12 characters'),
  bio: z.string().optional().nullable(),
  github: z
    .string()
    .optional()
    .nullable()
    .refine((url) => {
      if (!url || url.trim() === '') return true;
      const githubPattern = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9]([a-zA-Z0-9\-]){0,38}$/;
      return githubPattern.test(url);
    }, 'Please enter a valid GitHub URL (e.g., https://github.com/username)'),
  twitter: z
    .string()
    .optional()
    .nullable()
    .refine((url) => {
      if (!url || url.trim() === '') return true;
      const twitterPattern = /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/[a-zA-Z0-9_]{1,15}$/;
      return twitterPattern.test(url);
    }, 'Please enter a valid Twitter/X URL (e.g., https://twitter.com/username)'),
  linkedin: z
    .string()
    .optional()
    .nullable()
    .refine((url) => {
      if (!url || url.trim() === '') return true;
      const linkedinPattern = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9\-]{3,100}$/;
      return linkedinPattern.test(url);
    }, 'Please enter a valid LinkedIn URL (e.g., https://linkedin.com/in/username)'),
});

export type ProfileFormData = z.infer<typeof ProfileFormSchema>;
