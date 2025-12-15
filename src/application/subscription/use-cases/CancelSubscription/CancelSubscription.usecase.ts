import { injectable, inject } from 'tsyringe';
import { ISubscriberRepository } from '../../../../domain/subscription/repositories/ISubscriberRepository.interface';
import { IPaymentService } from '../../ports/IPaymentService.interface';
import { IEventDispatcher } from '../../../../domain/shared/events/IEventDispatcher.interface';
import { Email } from '../../../../domain/subscription/value-objects/Email.vo';
import { NotFoundError } from '../../../../domain/shared/errors/NotFoundError';
import { SubscriptionCancelled } from '../../../../domain/subscription/events/SubscriptionCancelled.event';
import { CancelSubscriptionInputDto, CancelSubscriptionOutputDto } from './CancelSubscription.dto';

@injectable()
export class CancelSubscriptionUseCase {
  constructor(
    @inject('ISubscriberRepository') private subscriberRepo: ISubscriberRepository,
    @inject('IPaymentService') private paymentService: IPaymentService,
    @inject('IEventDispatcher') private eventDispatcher: IEventDispatcher
  ) {}

  async execute(input: CancelSubscriptionInputDto): Promise<CancelSubscriptionOutputDto> {
    let subscriber;
    let subscriptionId: string;

    if (input.email) {
      const email = Email.create(input.email);
      subscriber = await this.subscriberRepo.findByEmail(email);

      if (!subscriber || !subscriber.stripeSubscriptionId) {
        throw new NotFoundError(`No active subscription found for email: ${input.email}`);
      }

      subscriptionId = subscriber.stripeSubscriptionId.getValue();
    } else if (input.subscriptionId) {
      subscriptionId = input.subscriptionId;
    } else {
      throw new Error('Either email or subscriptionId must be provided');
    }

    await this.paymentService.cancelSubscription(subscriptionId);

    if (subscriber) {
      subscriber.cancel();
      await this.subscriberRepo.save(subscriber);

      subscriber.addDomainEvent(
        new SubscriptionCancelled(subscriber.id.toString(), {
          subscriberId: subscriber.id.toString(),
          email: subscriber.email.getValue(),
          stripeSubscriptionId: subscriptionId,
          cancelledAt: new Date(),
        })
      );

      const events = subscriber.getDomainEvents();
      for (const event of events) {
        await this.eventDispatcher.dispatch(event);
      }
      subscriber.clearDomainEvents();
    }

    return {
      subscriptionId,
      status: 'cancelled',
      cancelledAt: new Date().toISOString(),
    };
  }
}
