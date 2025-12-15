export class StripeConfig {
  static get secretKey(): string {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is required in environment variables');
    }
    return process.env.STRIPE_SECRET_KEY;
  }

  static get publishableKey(): string {
    return process.env.STRIPE_PUBLISHABLE_KEY || '';
  }

  static get webhookSecret(): string {
    return process.env.STRIPE_WEBHOOK_SECRET || '';
  }

  static get priceId(): string {
    return process.env.STRIPE_PRICE_ID || '';
  }

  static get successUrl(): string {
    return process.env.STRIPE_SUCCESS_URL || 'http://localhost:8080/success';
  }

  static get cancelUrl(): string {
    return process.env.STRIPE_CANCEL_URL || 'http://localhost:8080/';
  }
}
