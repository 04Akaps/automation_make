import { StripeSubscriptionId } from '../value-objects/StripeSubscriptionId.vo';
import { SubscriptionPeriod } from '../value-objects/SubscriptionPeriod.vo';
import { ValidationError } from '../../shared/errors/ValidationError';

export interface SubscriptionProps {
  stripeSubscriptionId: StripeSubscriptionId;
  period: SubscriptionPeriod;
  cancelledAt: Date | null;
}

export class Subscription {
  private constructor(private props: SubscriptionProps) {}

  static create(props: SubscriptionProps): Subscription {
    return new Subscription(props);
  }

  get stripeSubscriptionId(): StripeSubscriptionId {
    return this.props.stripeSubscriptionId;
  }

  get period(): SubscriptionPeriod {
    return this.props.period;
  }

  get cancelledAt(): Date | null {
    return this.props.cancelledAt;
  }

  cancel(): void {
    if (this.isCancelled()) {
      throw new ValidationError('Subscription is already cancelled');
    }

    this.props.cancelledAt = new Date();
  }

  isCancelled(): boolean {
    return this.props.cancelledAt !== null;
  }

  isActive(): boolean {
    return !this.isCancelled() && this.props.period.isActive();
  }
}
