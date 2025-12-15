import { BaseDomainEvent } from '../../shared/events/DomainEvent.interface';

export interface SubscriptionActivatedPayload {
  subscriberId: string;
  email: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
}

export class SubscriptionActivated extends BaseDomainEvent {
  constructor(
    aggregateId: string,
    public readonly payload: SubscriptionActivatedPayload
  ) {
    super('SubscriptionActivated', aggregateId);
  }
}
