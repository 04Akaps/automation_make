import { z } from 'zod';

export const GetPriceInfoQuerySchema = z.object({
  priceId: z.string().optional(),
});

export type GetPriceInfoQuery = z.infer<typeof GetPriceInfoQuerySchema>;
