import { UniqueId } from '../../shared/value-objects/UniqueId.vo';
import { Email } from '../value-objects/Email.vo';
import { SubscriberName } from '../value-objects/SubscriberName.vo';
import { SubscriptionStatus } from '../value-objects/SubscriptionStatus.vo';
import { StripeCustomerId } from '../value-objects/StripeCustomerId.vo';
import { StripeSubscriptionId } from '../value-objects/StripeSubscriptionId.vo';
import { Subscription } from './Subscription.entity';
import { DomainEvent } from '../../shared/events/DomainEvent.interface';
import { DomainError } from '../../shared/errors/DomainError';

export interface SubscriberProps {
  id: UniqueId;
  email: Email;
  name: SubscriberName;
  status: SubscriptionStatus;
  stripeCustomerId: StripeCustomerId | null;
  stripeSubscriptionId: StripeSubscriptionId | null;
  subscription: Subscription | null;
  subscribedAt: Date | null;
  cancelledAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Subscriber {
  private domainEvents: DomainEvent[] = [];

  private constructor(private props: SubscriberProps) {}

  static create(props: SubscriberProps): Subscriber {
    return new Subscriber(props);
  }

  get id(): UniqueId {
    return this.props.id;
  }

  get email(): Email {
    return this.props.email;
  }

  get name(): SubscriberName {
    return this.props.name;
  }

  get status(): SubscriptionStatus {
    return this.props.status;
  }

  get stripeCustomerId(): StripeCustomerId | null {
    return this.props.stripeCustomerId;
  }

  get stripeSubscriptionId(): StripeSubscriptionId | null {
    return this.props.stripeSubscriptionId;
  }

  get subscription(): Subscription | null {
    return this.props.subscription;
  }

  get subscribedAt(): Date | null {
    return this.props.subscribedAt;
  }

  get cancelledAt(): Date | null {
    return this.props.cancelledAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  subscribe(
    customerId: StripeCustomerId,
    subscriptionId: StripeSubscriptionId,
    subscription: Subscription
  ): void {
    if (this.isActive()) {
      throw new DomainError('Subscriber already has an active subscription');
    }

    this.props.stripeCustomerId = customerId;
    this.props.stripeSubscriptionId = subscriptionId;
    this.props.subscription = subscription;
    this.props.status = SubscriptionStatus.active();
    this.props.subscribedAt = this.props.subscribedAt || new Date();
    this.props.cancelledAt = null;
    this.props.updatedAt = new Date();
  }

  cancel(): void {
    if (!this.isActive()) {
      throw new DomainError('No active subscription to cancel');
    }

    if (this.props.subscription) {
      this.props.subscription.cancel();
    }

    this.props.status = SubscriptionStatus.cancelled();
    this.props.cancelledAt = new Date();
    this.props.updatedAt = new Date();
  }

  reactivate(subscriptionId: StripeSubscriptionId, subscription: Subscription): void {
    if (!this.props.stripeCustomerId) {
      throw new DomainError('Cannot reactivate subscriber without Stripe customer ID');
    }

    this.props.stripeSubscriptionId = subscriptionId;
    this.props.subscription = subscription;
    this.props.status = SubscriptionStatus.active();
    this.props.cancelledAt = null;
    this.props.updatedAt = new Date();
  }

  isActive(): boolean {
    return this.props.status.isActive();
  }

  isCancelled(): boolean {
    return this.props.status.isCancelled();
  }

  addDomainEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  getDomainEvents(): DomainEvent[] {
    return [...this.domainEvents];
  }

  clearDomainEvents(): void {
    this.domainEvents = [];
  }
}
