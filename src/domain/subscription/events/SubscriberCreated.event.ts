import { BaseDomainEvent } from '../../shared/events/DomainEvent.interface';

export interface SubscriberCreatedPayload {
  subscriberId: string;
  email: string;
  name: string | null;
  stripeCustomerId: string | null;
}

export class SubscriberCreated extends BaseDomainEvent {
  constructor(
    aggregateId: string,
    public readonly payload: SubscriberCreatedPayload
  ) {
    super('SubscriberCreated', aggregateId);
  }
}
