import { injectable, inject } from 'tsyringe';
import winston from 'winston';
import { ISubscriberRepository } from '../../../../domain/subscription/repositories/ISubscriberRepository.interface';
import { IPaymentService } from '../../ports/IPaymentService.interface';
import { Email } from '../../../../domain/subscription/value-objects/Email.vo';
import { GetSubscriptionStatusInputDto, GetSubscriptionStatusOutputDto } from './GetSubscriptionStatus.dto';
import { SubscriberMapper } from '../../mappers/SubscriberMapper';

@injectable()
export class GetSubscriptionStatusUseCase {
  constructor(
    @inject('ISubscriberRepository') private subscriberRepo: ISubscriberRepository,
    @inject('IPaymentService') private paymentService: IPaymentService,
    @inject('Logger') private logger: winston.Logger
  ) {}

  async execute(input: GetSubscriptionStatusInputDto): Promise<GetSubscriptionStatusOutputDto | null> {
    const email = Email.create(input.email);
    const subscriber = await this.subscriberRepo.findByEmail(email);

    if (!subscriber) {
      return null;
    }

    const dto = SubscriberMapper.toDto(subscriber);

    if (subscriber.stripeSubscriptionId && subscriber.isActive()) {
      try {
        const subscription = await this.paymentService.getSubscription(
          subscriber.stripeSubscriptionId.getValue()
        );

        dto.currentPeriodEnd = new Date(subscription.currentPeriodEnd * 1000).toISOString();
      } catch (error) {
        this.logger.error({
          location: 'GetSubscriptionStatusUseCase',
          code: 'STRIPE_FETCH_ERROR',
          message: error instanceof Error ? error.message : String(error)
        } as any);
      }
    }

    return dto;
  }
}
