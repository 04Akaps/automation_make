import { z } from 'zod';

export const CreateSubscriptionBodySchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().optional(),
  paymentMethodId: z.string().min(1, 'Payment method ID is required'),
  priceId: z.string().optional(),
});

export type CreateSubscriptionBody = z.infer<typeof CreateSubscriptionBodySchema>;
