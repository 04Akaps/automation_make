import { StripeSubscriptionId } from '../value-objects/StripeSubscriptionId.vo';
import { SubscriptionPeriod } from '../value-objects/SubscriptionPeriod.vo';
import { ValidationError } from '../../shared/errors/ValidationError';

export interface SubscriptionProps {
  stripeSubscriptionId: StripeSubscriptionId;
  period: SubscriptionPeriod;
  cancelledAt: Date | null;
}

export class Subscription {
  public readonly stripeSubscriptionId: StripeSubscriptionId;
  public readonly period: SubscriptionPeriod;
  private _cancelledAt: Date | null;

  private constructor(props: SubscriptionProps) {
    this.stripeSubscriptionId = props.stripeSubscriptionId;
    this.period = props.period;
    this._cancelledAt = props.cancelledAt;
  }

  static create(props: SubscriptionProps): Subscription {
    return new Subscription(props);
  }

  get cancelledAt(): Date | null {
    return this._cancelledAt;
  }

  cancel(): void {
    if (this.isCancelled()) {
      throw new ValidationError('Subscription is already cancelled');
    }

    this._cancelledAt = new Date();
  }

  isCancelled(): boolean {
    return this._cancelledAt !== null;
  }

  isActive(): boolean {
    return !this.isCancelled() && this.period.isActive();
  }
}
