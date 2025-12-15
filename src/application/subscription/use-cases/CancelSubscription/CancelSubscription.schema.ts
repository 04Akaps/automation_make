import { z } from 'zod';

export const CancelSubscriptionByEmailBodySchema = z.object({
  email: z.string().email('Invalid email format'),
});

export const CancelSubscriptionByIdParamsSchema = z.object({
  subscriptionId: z.string().min(1, 'Subscription ID is required'),
});

export type CancelSubscriptionByEmailBody = z.infer<typeof CancelSubscriptionByEmailBodySchema>;
export type CancelSubscriptionByIdParams = z.infer<typeof CancelSubscriptionByIdParamsSchema>;
