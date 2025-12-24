import { z } from 'zod';

export const GetNewslettersQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
  serviceName: z.string().optional(),
});

export type GetNewslettersQuery = z.infer<typeof GetNewslettersQuerySchema>;
