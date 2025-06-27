import { z } from 'zod';
import { generateUUID } from '@/lib/utils';

export const postRequestBodySchema = z.object({
  id: z
    .string()
    .uuid()
    .optional()
    .default(() => generateUUID())
    .or(z.literal('')),
  name: z.string().min(1).max(255),
  description: z.string().max(2000),
  instructions: z.string().max(2000),
  model: z.string().min(1).max(100),
  image: z.string().url(),
});

export type PostRequestBody = z.infer<typeof postRequestBodySchema>;
