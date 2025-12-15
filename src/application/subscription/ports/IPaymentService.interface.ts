export interface CreateSubscriptionParams {
  email: string;
  name?: string;
  paymentMethodId: string;
  priceId?: string;
}

export interface SubscriptionResult {
  subscriptionId: string;
  customerId: string;
  status: string;
  currentPeriodEnd: number;
  clientSecret?: string;
}

export interface CreateCheckoutSessionParams {
  email: string;
  priceId?: string;
}

export interface CheckoutSessionResult {
  clientSecret: string;
}

export interface CustomerResult {
  customerId: string;
  email: string;
  subscriptions: {
    id: string;
    status: string;
    currentPeriodEnd: number;
  }[];
}

export interface PriceResult {
  id: string;
  amount: number;
  currency: string;
  interval: string;
  intervalCount: number;
  productName: string;
  productDescription: string | null;
}

export interface IPaymentService {
  createSubscription(params: CreateSubscriptionParams): Promise<SubscriptionResult>;
  cancelSubscription(subscriptionId: string): Promise<void>;
  getCustomer(email: string): Promise<CustomerResult | null>;
  getSubscription(subscriptionId: string): Promise<SubscriptionResult>;
  createCheckoutSession(params: CreateCheckoutSessionParams): Promise<CheckoutSessionResult>;
  getPriceInfo(priceId: string): Promise<PriceResult>;
  constructWebhookEvent(payload: Buffer, signature: string): Promise<any>;
}
