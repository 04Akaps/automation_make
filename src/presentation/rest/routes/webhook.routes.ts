import { Router, Request, Response } from 'express';
import express from 'express';
import { container } from '../../../di/container';
import { DI_TOKENS } from '../../../di/tokens';
import { IPaymentService } from '../../../application/subscription/ports/IPaymentService.interface';
import { ISubscriberRepository } from '../../../domain/subscription/repositories/ISubscriberRepository.interface';
import { StripeCustomerId } from '../../../domain/subscription/value-objects/StripeCustomerId.vo';
import { Email } from '../../../domain/subscription/value-objects/Email.vo';
import { SubscriberName } from '../../../domain/subscription/value-objects/SubscriberName.vo';
import { SubscriptionStatus } from '../../../domain/subscription/value-objects/SubscriptionStatus.vo';
import { StripeSubscriptionId } from '../../../domain/subscription/value-objects/StripeSubscriptionId.vo';
import { Subscriber } from '../../../domain/subscription/entities/Subscriber.entity';
import { UniqueId } from '../../../domain/shared/value-objects/UniqueId.vo';

const router = Router();

router.post('/stripe', async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  const paymentService = container.resolve<IPaymentService>(DI_TOKENS.PAYMENT_SERVICE);
  const subscriberRepo = container.resolve<ISubscriberRepository>(DI_TOKENS.SUBSCRIBER_REPOSITORY);

  try {
    const event = await paymentService.constructWebhookEvent(req.body, sig);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log(`[WEBHOOK] Checkout completed | session: ${session.id} | email: ${session.customer_email}`);

        if (session.subscription && session.customer_email) {
          const email = Email.create(session.customer_email);
          const existingSubscriber = await subscriberRepo.findByEmail(email);

          if (existingSubscriber) {
            existingSubscriber.reactivate(
              StripeSubscriptionId.create(session.subscription as string),
              null as any
            );
            await subscriberRepo.save(existingSubscriber);
            console.log(`[WEBHOOK] Subscriber reactivated | email: ${session.customer_email}`);
          } else {
            const newSubscriber = Subscriber.create({
              id: UniqueId.create(0),
              email,
              name: SubscriberName.create(session.customer_details?.name),
              status: SubscriptionStatus.active(),
              stripeCustomerId: StripeCustomerId.create(session.customer as string),
              stripeSubscriptionId: StripeSubscriptionId.create(session.subscription as string),
              subscription: null,
              subscribedAt: new Date(),
              cancelledAt: null,
              createdAt: new Date(),
              updatedAt: new Date(),
            });

            await subscriberRepo.create(newSubscriber);
            console.log(`[WEBHOOK] New subscriber created | email: ${session.customer_email}`);
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const subscriber = await subscriberRepo.findByStripeCustomerId(
          StripeCustomerId.create(subscription.customer as string)
        );

        if (subscriber) {
          subscriber.cancel();
          await subscriberRepo.save(subscriber);
          console.log(`[WEBHOOK] Subscription cancelled | email: ${subscriber.email.getValue()}`);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const subscriber = await subscriberRepo.findByStripeCustomerId(
          StripeCustomerId.create(subscription.customer as string)
        );

        if (subscriber) {
          if (subscription.status === 'active' || subscription.status === 'trialing') {
            if (!subscriber.isActive()) {
              subscriber.reactivate(
                StripeSubscriptionId.create(subscription.id),
                null as any
              );
              await subscriberRepo.save(subscriber);
              console.log(`[WEBHOOK] Subscription reactivated | email: ${subscriber.email.getValue()}`);
            }
          } else if (subscription.status === 'canceled') {
            subscriber.cancel();
            await subscriberRepo.save(subscriber);
            console.log(`[WEBHOOK] Subscription synced to cancelled | email: ${subscriber.email.getValue()}`);
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        console.error(`[WEBHOOK] Payment failed | invoice: ${invoice.id}`);
        break;
      }

      default:
        break;
    }

    res.json({ received: true });
  } catch (err: any) {
    console.error('Webhook processing error:', err);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

export default router;
