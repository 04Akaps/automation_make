import { Router, Request, Response } from 'express';
import winston from 'winston';
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
const logger = container.resolve<winston.Logger>(DI_TOKENS.LOGGER);

router.post('/stripe', async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  const paymentService = container.resolve<IPaymentService>(DI_TOKENS.PAYMENT_SERVICE);
  const subscriberRepo = container.resolve<ISubscriberRepository>(DI_TOKENS.SUBSCRIBER_REPOSITORY);

  try {
    const event = await paymentService.constructWebhookEvent(req.body, sig);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        logger.info({
          location: 'WebhookRoute',
          event: 'checkout.session.completed',
          sessionId: session.id,
          email: session.customer_email,
          message: 'Checkout completed'
        } as any);

        if (session.subscription && session.customer_email) {
          const email = Email.create(session.customer_email);
          const existingSubscriber = await subscriberRepo.findByEmail(email);

          if (existingSubscriber) {
            existingSubscriber.reactivate(
              StripeSubscriptionId.create(session.subscription as string),
              null as any
            );
            await subscriberRepo.save(existingSubscriber);
            logger.info({
              location: 'WebhookRoute',
              event: 'subscriber_reactivated',
              email: session.customer_email,
              message: 'Subscriber reactivated'
            } as any);
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
            logger.info({
              location: 'WebhookRoute',
              event: 'subscriber_created',
              email: session.customer_email,
              message: 'New subscriber created'
            } as any);
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
          logger.info({
            location: 'WebhookRoute',
            event: 'subscription_cancelled',
            email: subscriber.email.getValue(),
            message: 'Subscription cancelled'
          } as any);
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
              logger.info({
                location: 'WebhookRoute',
                event: 'subscription_reactivated',
                email: subscriber.email.getValue(),
                message: 'Subscription reactivated'
              } as any);
            }
          } else if (subscription.status === 'canceled') {
            subscriber.cancel();
            await subscriberRepo.save(subscriber);
            logger.info({
              location: 'WebhookRoute',
              event: 'subscription_synced_cancelled',
              email: subscriber.email.getValue(),
              message: 'Subscription synced to cancelled'
            } as any);
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        logger.error({
          location: 'WebhookRoute',
          event: 'invoice.payment_failed',
          invoiceId: invoice.id,
          code: 'PAYMENT_FAILED',
          message: `Payment failed for invoice ${invoice.id}`
        } as any);
        break;
      }

      default:
        break;
    }

    res.json({ received: true });
  } catch (err: any) {
    logger.error({
      location: 'WebhookRoute',
      code: 'WEBHOOK_ERROR',
      message: err instanceof Error ? err.message : String(err)
    } as any);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

export default router;
