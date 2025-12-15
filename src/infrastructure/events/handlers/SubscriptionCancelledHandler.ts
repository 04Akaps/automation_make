import { injectable, inject } from 'tsyringe';
import { EventHandler } from '../../../domain/shared/events/IEventDispatcher.interface';
import { DomainEvent } from '../../../domain/shared/events/DomainEvent.interface';
import { SubscriptionCancelled } from '../../../domain/subscription/events/SubscriptionCancelled.event';
import winston from 'winston';

@injectable()
export class SubscriptionCancelledHandler implements EventHandler {
  constructor(@inject('Logger') private logger: winston.Logger) {}

  async handle(event: DomainEvent): Promise<void> {
    if (event.eventName !== 'SubscriptionCancelled') {
      return;
    }

    const cancelEvent = event as SubscriptionCancelled;

    this.logger.info('SubscriptionCancelledHandler', {
      subscriberId: cancelEvent.payload.subscriberId,
      email: cancelEvent.payload.email,
      message: 'Subscription cancelled',
    });
  }
}
