import { ValueObject } from '../../shared/value-objects/ValueObject';

export type SubscriptionStatusType = 'active' | 'cancelled';

export class SubscriptionStatus extends ValueObject {
  private constructor(private readonly value: SubscriptionStatusType) {
    super();
  }

  static create(value: SubscriptionStatusType): SubscriptionStatus {
    return new SubscriptionStatus(value);
  }

  static active(): SubscriptionStatus {
    return new SubscriptionStatus('active');
  }

  static cancelled(): SubscriptionStatus {
    return new SubscriptionStatus('cancelled');
  }

  getValue(): SubscriptionStatusType {
    return this.value;
  }

  isActive(): boolean {
    return this.value === 'active';
  }

  isCancelled(): boolean {
    return this.value === 'cancelled';
  }

  protected equals(other: SubscriptionStatus): boolean {
    return this.value === other.value;
  }
}
