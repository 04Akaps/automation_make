import { ValueObject } from '../../shared/value-objects/ValueObject';
import { ValidationError } from '../../shared/errors/ValidationError';

export class StripeSubscriptionId extends ValueObject {
  private constructor(private readonly value: string) {
    super();
    this.validate(value);
  }

  static create(id: string): StripeSubscriptionId {
    return new StripeSubscriptionId(id);
  }

  private validate(id: string): void {
    if (!id || id.trim().length === 0) {
      throw new ValidationError('Stripe Subscription ID cannot be empty');
    }

    if (!id.startsWith('sub_')) {
      throw new ValidationError('Invalid Stripe Subscription ID format');
    }
  }

  getValue(): string {
    return this.value;
  }

  toString(): string {
    return this.value;
  }

  protected equals(other: StripeSubscriptionId): boolean {
    return this.value === other.value;
  }
}
