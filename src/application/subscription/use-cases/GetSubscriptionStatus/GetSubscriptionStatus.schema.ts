import { z } from 'zod';

export const GetSubscriptionStatusParamsSchema = z.object({
  email: z.string().email('Invalid email format'),
});

export type GetSubscriptionStatusParams = z.infer<typeof GetSubscriptionStatusParamsSchema>;
