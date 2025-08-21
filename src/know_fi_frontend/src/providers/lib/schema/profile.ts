import { z } from 'zod';

export const ProfileFormSchema = z.object({
  name: z.string().min(3, 'Username must be at least 3 characters').max(12, 'Username must be at most 12 characters'),
  userName: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(12, 'Username must be at most 12 characters'),
  bio: z.string(),
  github: z
    .string()
    .url('Please enter a valid URL')
    .refine((url) => {
      const githubPattern = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9]([a-zA-Z0-9\-]){0,38}$/;
      return githubPattern.test(url);
    }, 'Please enter a valid GitHub URL (e.g., https://github.com/username)'),
  twitter: z
    .string()
    .url('Please enter a valid URL')
    .refine((url) => {
      const twitterPattern = /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/[a-zA-Z0-9_]{1,15}$/;
      return twitterPattern.test(url);
    }, 'Please enter a valid Twitter/X URL (e.g., https://twitter.com/username)'),
  linkedin: z
    .string()
    .url('Please enter a valid URL')
    .refine((url) => {
      const linkedinPattern = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9\-]{3,100}$/;
      return linkedinPattern.test(url);
    }, 'Please enter a valid LinkedIn URL (e.g., https://linkedin.com/in/username)'),
});

export type ProfileFormData = z.infer<typeof ProfileFormSchema>;
