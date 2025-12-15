import { BaseDomainEvent } from '../../shared/events/DomainEvent.interface';

export interface SubscriptionCancelledPayload {
  subscriberId: string;
  email: string;
  stripeSubscriptionId: string;
  cancelledAt: Date;
}

export class SubscriptionCancelled extends BaseDomainEvent {
  constructor(
    aggregateId: string,
    public readonly payload: SubscriptionCancelledPayload
  ) {
    super('SubscriptionCancelled', aggregateId);
  }
}
