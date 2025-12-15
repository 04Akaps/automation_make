import { z } from 'zod';

export const GetNewsletterByIdParamsSchema = z.object({
  id: z.string().or(z.number()),
});

export type GetNewsletterByIdParams = z.infer<typeof GetNewsletterByIdParamsSchema>;
