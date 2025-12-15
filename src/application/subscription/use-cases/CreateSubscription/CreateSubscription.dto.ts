export interface CreateSubscriptionInputDto {
  email: string;
  name?: string;
  paymentMethodId: string;
  priceId?: string;
}

export interface CreateSubscriptionOutputDto {
  subscriptionId: string;
  customerId: string;
  status: string;
  currentPeriodEnd: number;
  clientSecret?: string;
}
