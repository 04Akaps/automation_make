import { injectable } from 'tsyringe';
import Stripe from 'stripe';
import {
  IPaymentService,
  CreateSubscriptionParams,
  SubscriptionResult,
  CreateCheckoutSessionParams,
  CheckoutSessionResult,
  CustomerResult,
  PriceResult,
} from '../../../application/subscription/ports/IPaymentService.interface';
import { StripeConfig } from './StripeConfig';
import { handleStripeError } from '../../../utils/stripeErrorHandler';

@injectable()
export class StripePaymentService implements IPaymentService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(StripeConfig.secretKey, {
      apiVersion: '2025-02-24.acacia',
      typescript: true,
    });
  }

  async createSubscription(params: CreateSubscriptionParams): Promise<SubscriptionResult> {
    try {
      const customer = await this.findOrCreateCustomer(params.email, params.name);

      await this.stripe.paymentMethods.attach(params.paymentMethodId, {
        customer: customer.id,
      });

      await this.stripe.customers.update(customer.id, {
        invoice_settings: {
          default_payment_method: params.paymentMethodId,
        },
      });

      const subscription = await this.stripe.subscriptions.create({
        customer: customer.id,
        items: [
          {
            price: params.priceId || StripeConfig.priceId,
          },
        ],
        payment_settings: {
          payment_method_types: ['card'],
          save_default_payment_method: 'on_subscription',
        },
        expand: ['latest_invoice.payment_intent'],
      });

      const result: SubscriptionResult = {
        subscriptionId: subscription.id,
        customerId: customer.id,
        status: subscription.status,
        currentPeriodEnd: subscription.current_period_end,
      };

      const latestInvoice = subscription.latest_invoice as Stripe.Invoice;
      if (latestInvoice?.payment_intent) {
        const paymentIntent = latestInvoice.payment_intent as Stripe.PaymentIntent;
        if (paymentIntent.client_secret) {
          result.clientSecret = paymentIntent.client_secret;
        }
      }

      return result;
    } catch (error) {
      const errorInfo = handleStripeError(error);
      throw new Error(errorInfo.detailMessage);
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    try {
      await this.stripe.subscriptions.cancel(subscriptionId);
    } catch (error) {
      const errorInfo = handleStripeError(error);
      throw new Error(errorInfo.detailMessage);
    }
  }

  async getCustomer(email: string): Promise<CustomerResult | null> {
    try {
      const customers = await this.stripe.customers.list({
        email,
        limit: 1,
      });

      if (customers.data.length === 0) {
        return null;
      }

      const customer = customers.data[0];
      const subscriptions = await this.stripe.subscriptions.list({
        customer: customer.id,
        limit: 10,
      });

      return {
        customerId: customer.id,
        email: customer.email!,
        subscriptions: subscriptions.data.map(sub => ({
          id: sub.id,
          status: sub.status,
          currentPeriodEnd: sub.current_period_end,
        })),
      };
    } catch (error) {
      const errorInfo = handleStripeError(error);
      throw new Error(errorInfo.detailMessage);
    }
  }

  async getSubscription(subscriptionId: string): Promise<SubscriptionResult> {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);

      return {
        subscriptionId: subscription.id,
        customerId: subscription.customer as string,
        status: subscription.status,
        currentPeriodEnd: subscription.current_period_end,
      };
    } catch (error) {
      const errorInfo = handleStripeError(error);
      throw new Error(errorInfo.detailMessage);
    }
  }

  async createCheckoutSession(params: CreateCheckoutSessionParams): Promise<CheckoutSessionResult> {
    try {
      const session = await this.stripe.checkout.sessions.create({
        ui_mode: 'embedded',
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: params.priceId || StripeConfig.priceId,
            quantity: 1,
          },
        ],
        customer_email: params.email,
        return_url: `${StripeConfig.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
        metadata: {
          email: params.email,
        },
      });

      return {
        clientSecret: session.client_secret!,
      };
    } catch (error) {
      const errorInfo = handleStripeError(error);
      throw new Error(errorInfo.detailMessage);
    }
  }

  async getPriceInfo(priceId: string): Promise<PriceResult> {
    try {
      const price = await this.stripe.prices.retrieve(priceId, {
        expand: ['product'],
      });

      const product = price.product as Stripe.Product;

      return {
        id: price.id,
        amount: price.unit_amount! / 100,
        currency: price.currency.toUpperCase(),
        interval: price.recurring?.interval || 'month',
        intervalCount: price.recurring?.interval_count || 1,
        productName: product.name,
        productDescription: product.description,
      };
    } catch (error) {
      const errorInfo = handleStripeError(error);
      throw new Error(errorInfo.detailMessage);
    }
  }

  async constructWebhookEvent(payload: Buffer, signature: string): Promise<any> {
    try {
      return this.stripe.webhooks.constructEvent(
        payload,
        signature,
        StripeConfig.webhookSecret
      );
    } catch (error) {
      const errorInfo = handleStripeError(error);
      throw new Error(errorInfo.detailMessage);
    }
  }

  private async findOrCreateCustomer(email: string, name?: string): Promise<Stripe.Customer> {
    const existingCustomers = await this.stripe.customers.list({
      email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      return existingCustomers.data[0];
    }

    return await this.stripe.customers.create({
      email,
      name: name || undefined,
      metadata: {
        source: 'newsletters_app',
      },
    });
  }
}
