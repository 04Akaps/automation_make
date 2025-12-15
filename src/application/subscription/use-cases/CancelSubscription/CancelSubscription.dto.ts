export interface CancelSubscriptionInputDto {
  email?: string;
  subscriptionId?: string;
}

export interface CancelSubscriptionOutputDto {
  subscriptionId: string;
  status: string;
  cancelledAt: string;
}
