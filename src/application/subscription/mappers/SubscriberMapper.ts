import { Subscriber } from '../../../domain/subscription/entities/Subscriber.entity';
import { GetSubscriptionStatusOutputDto } from '../use-cases/GetSubscriptionStatus/GetSubscriptionStatus.dto';

export class SubscriberMapper {
  static toDto(entity: Subscriber): GetSubscriptionStatusOutputDto {
    return {
      id: entity.id.getValue(),
      email: entity.email.getValue(),
      name: entity.name.getValue(),
      status: entity.status.getValue(),
      stripeCustomerId: entity.stripeCustomerId?.getValue() || null,
      stripeSubscriptionId: entity.stripeSubscriptionId?.getValue() || null,
      subscribedAt: entity.subscribedAt ? entity.subscribedAt.toISOString() : null,
      cancelledAt: entity.cancelledAt ? entity.cancelledAt.toISOString() : null,
    };
  }
}
