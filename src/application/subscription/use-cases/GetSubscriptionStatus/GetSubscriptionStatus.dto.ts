export interface GetSubscriptionStatusInputDto {
  email: string;
}

export interface GetSubscriptionStatusOutputDto {
  id: number | string;
  email: string;
  name: string | null;
  status: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  subscribedAt: string | null;
  cancelledAt: string | null;
  currentPeriodEnd?: string | null;
}
