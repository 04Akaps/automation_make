import { injectable, inject } from 'tsyringe';
import { EventHandler } from '../../../domain/shared/events/IEventDispatcher.interface';
import { DomainEvent } from '../../../domain/shared/events/DomainEvent.interface';
import { SubscriberCreated } from '../../../domain/subscription/events/SubscriberCreated.event';
import winston from 'winston';

@injectable()
export class SubscriberCreatedHandler implements EventHandler {
  constructor(@inject('Logger') private logger: winston.Logger) {}

  async handle(event: DomainEvent): Promise<void> {
    if (event.eventName !== 'SubscriberCreated') {
      return;
    }

    const subscriberEvent = event as SubscriberCreated;

    this.logger.info('SubscriberCreatedHandler', {
      subscriberId: subscriberEvent.payload.subscriberId,
      email: subscriberEvent.payload.email,
      message: 'New subscriber created',
    });
  }
}
