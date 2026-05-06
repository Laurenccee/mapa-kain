import { z } from 'zod';

export const profileSchema = z.object({
  full_name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name is too long')
    .trim(),

  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username is too long')
    .regex(
      /^[a-zA-Z0-9._]+$/,
      'Only letters, numbers, dots, and underscores allowed',
    )
    .toLowerCase()
    .trim(),

  phone_number: z
    .string()
    .regex(
      /^\+639\d{9}$/,
      'Please enter a valid PH mobile number (+63XXXXXXXXX)',
    )
    .optional()
    .or(z.literal('')),

  avatar_url: z.string().url().optional().or(z.literal('')),
});

// Type for your form
export type ProfileFormValues = z.infer<typeof profileSchema>;
