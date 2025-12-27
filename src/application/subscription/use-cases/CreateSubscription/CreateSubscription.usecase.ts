import { injectable, inject } from 'tsyringe';
import { ISubscriberRepository } from '../../../../domain/subscription/repositories/ISubscriberRepository.interface';
import { IPaymentService } from '../../ports/IPaymentService.interface';
import { IEventDispatcher } from '../../../../domain/shared/events/IEventDispatcher.interface';
import { Email } from '../../../../domain/subscription/value-objects/Email.vo';
import { SubscriberName } from '../../../../domain/subscription/value-objects/SubscriberName.vo';
import { StripeCustomerId } from '../../../../domain/subscription/value-objects/StripeCustomerId.vo';
import { StripeSubscriptionId } from '../../../../domain/subscription/value-objects/StripeSubscriptionId.vo';
import { SubscriptionStatus } from '../../../../domain/subscription/value-objects/SubscriptionStatus.vo';
import { Subscription } from '../../../../domain/subscription/entities/Subscription.entity';
import { Subscriber } from '../../../../domain/subscription/entities/Subscriber.entity';
import { SubscriptionPeriod } from '../../../../domain/subscription/value-objects/SubscriptionPeriod.vo';
import { UniqueId } from '../../../../domain/shared/value-objects/UniqueId.vo';
import { SubscriberCreated } from '../../../../domain/subscription/events/SubscriberCreated.event';
import { CreateSubscriptionInputDto, CreateSubscriptionOutputDto } from './CreateSubscription.dto';

@injectable()
export class CreateSubscriptionUseCase {
  constructor(
    @inject('ISubscriberRepository') private subscriberRepo: ISubscriberRepository,
    @inject('IPaymentService') private paymentService: IPaymentService,
    @inject('IEventDispatcher') private eventDispatcher: IEventDispatcher
  ) {}

  async execute(input: CreateSubscriptionInputDto): Promise<CreateSubscriptionOutputDto> {
    const email = Email.create(input.email);
    let subscriber = await this.subscriberRepo.findByEmail(email);

    const paymentResult = await this.paymentService.createSubscription({
      email: input.email,
      name: input.name,
      paymentMethodId: input.paymentMethodId,
      priceId: input.priceId,
    });

    const subscription = Subscription.create({
      stripeSubscriptionId: StripeSubscriptionId.create(paymentResult.subscriptionId),
      period: SubscriptionPeriod.createFromTimestamps(
        Math.floor(Date.now() / 1000),
        paymentResult.currentPeriodEnd
      ),
      cancelledAt: null,
    });

    if (!subscriber) {
      subscriber = Subscriber.create({
        id: UniqueId.create(0),
        email,
        name: SubscriberName.create(input.name),
        status: SubscriptionStatus.active(),
        stripeCustomerId: StripeCustomerId.create(paymentResult.customerId),
        stripeSubscriptionId: StripeSubscriptionId.create(paymentResult.subscriptionId),
        subscription,
        subscribedAt: new Date(),
        cancelledAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      subscriber = await this.subscriberRepo.create(subscriber);

      subscriber.addDomainEvent(
        new SubscriberCreated(subscriber.id.toString(), {
          subscriberId: subscriber.id.toString(),
          email: subscriber.email.getValue(),
          name: subscriber.name.getValue(),
          stripeCustomerId: subscriber.stripeCustomerId?.getValue() || null,
        })
      );
    } else {
      subscriber.subscribe(
        StripeCustomerId.create(paymentResult.customerId),
        StripeSubscriptionId.create(paymentResult.subscriptionId),
        subscription
      );

      await this.subscriberRepo.save(subscriber);
    }

    const events = subscriber.getDomainEvents();
    for (const event of events) {
      await this.eventDispatcher.dispatch(event);
    }
    subscriber.clearDomainEvents();

    return {
      subscriptionId: paymentResult.subscriptionId,
      customerId: paymentResult.customerId,
      status: paymentResult.status,
      currentPeriodEnd: paymentResult.currentPeriodEnd,
      clientSecret: paymentResult.clientSecret,
    };
  }
}
