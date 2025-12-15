import { Subscriber, SubscriberProps } from '../../../../domain/subscription/entities/Subscriber.entity';
import { UniqueId } from '../../../../domain/shared/value-objects/UniqueId.vo';
import { Email } from '../../../../domain/subscription/value-objects/Email.vo';
import { SubscriberName } from '../../../../domain/subscription/value-objects/SubscriberName.vo';
import { SubscriptionStatus } from '../../../../domain/subscription/value-objects/SubscriptionStatus.vo';
import { StripeCustomerId } from '../../../../domain/subscription/value-objects/StripeCustomerId.vo';
import { StripeSubscriptionId } from '../../../../domain/subscription/value-objects/StripeSubscriptionId.vo';
import { SubscriberRow } from '../types/SubscriberRow';

export class SubscriberPersistenceMapper {
  static toDomain(row: SubscriberRow): Subscriber {
    const props: SubscriberProps = {
      id: UniqueId.create(row.id),
      email: Email.create(row.email),
      name: SubscriberName.create(row.name),
      status: SubscriptionStatus.create(row.status),
      stripeCustomerId: row.stripe_customer_id ? StripeCustomerId.create(row.stripe_customer_id) : null,
      stripeSubscriptionId: row.stripe_subscription_id ? StripeSubscriptionId.create(row.stripe_subscription_id) : null,
      subscription: null,
      subscribedAt: row.subscribed_at,
      cancelledAt: row.cancelled_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };

    return Subscriber.create(props);
  }

  static toPersistence(entity: Subscriber): any {
    return {
      id: Number(entity.id.getValue()),
      email: entity.email.getValue(),
      name: entity.name.getValue(),
      status: entity.status.getValue(),
      stripe_customer_id: entity.stripeCustomerId?.getValue() || null,
      stripe_subscription_id: entity.stripeSubscriptionId?.getValue() || null,
      subscribed_at: entity.subscribedAt,
      cancelled_at: entity.cancelledAt,
    };
  }
}
