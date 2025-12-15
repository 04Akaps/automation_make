import { z } from 'zod';

export const CreateCheckoutSessionBodySchema = z.object({
  email: z.string().email('Invalid email format'),
  priceId: z.string().optional(),
});

export type CreateCheckoutSessionBody = z.infer<typeof CreateCheckoutSessionBodySchema>;
