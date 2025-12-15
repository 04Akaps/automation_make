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

  public readonly id: UniqueId;
  public readonly email: Email;
  public readonly name: SubscriberName;
  public readonly createdAt: Date;

  private _status: SubscriptionStatus;
  private _stripeCustomerId: StripeCustomerId | null;
  private _stripeSubscriptionId: StripeSubscriptionId | null;
  private _subscription: Subscription | null;
  private _subscribedAt: Date | null;
  private _cancelledAt: Date | null;
  private _updatedAt: Date;

  private constructor(props: SubscriberProps) {
    this.id = props.id;
    this.email = props.email;
    this.name = props.name;
    this.createdAt = props.createdAt;
    this._status = props.status;
    this._stripeCustomerId = props.stripeCustomerId;
    this._stripeSubscriptionId = props.stripeSubscriptionId;
    this._subscription = props.subscription;
    this._subscribedAt = props.subscribedAt;
    this._cancelledAt = props.cancelledAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: SubscriberProps): Subscriber {
    return new Subscriber(props);
  }

  get status(): SubscriptionStatus {
    return this._status;
  }

  get stripeCustomerId(): StripeCustomerId | null {
    return this._stripeCustomerId;
  }

  get stripeSubscriptionId(): StripeSubscriptionId | null {
    return this._stripeSubscriptionId;
  }

  get subscription(): Subscription | null {
    return this._subscription;
  }

  get subscribedAt(): Date | null {
    return this._subscribedAt;
  }

  get cancelledAt(): Date | null {
    return this._cancelledAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  subscribe(
    customerId: StripeCustomerId,
    subscriptionId: StripeSubscriptionId,
    subscription: Subscription
  ): void {
    if (this.isActive()) {
      throw new DomainError('Subscriber already has an active subscription');
    }

    this._stripeCustomerId = customerId;
    this._stripeSubscriptionId = subscriptionId;
    this._subscription = subscription;
    this._status = SubscriptionStatus.active();
    this._subscribedAt = this._subscribedAt || new Date();
    this._cancelledAt = null;
    this._updatedAt = new Date();
  }

  cancel(): void {
    if (!this.isActive()) {
      throw new DomainError('No active subscription to cancel');
    }

    if (this._subscription) {
      this._subscription.cancel();
    }

    this._status = SubscriptionStatus.cancelled();
    this._cancelledAt = new Date();
    this._updatedAt = new Date();
  }

  reactivate(subscriptionId: StripeSubscriptionId, subscription: Subscription): void {
    if (!this._stripeCustomerId) {
      throw new DomainError('Cannot reactivate subscriber without Stripe customer ID');
    }

    this._stripeSubscriptionId = subscriptionId;
    this._subscription = subscription;
    this._status = SubscriptionStatus.active();
    this._cancelledAt = null;
    this._updatedAt = new Date();
  }

  isActive(): boolean {
    return this._status.isActive();
  }

  isCancelled(): boolean {
    return this._status.isCancelled();
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
