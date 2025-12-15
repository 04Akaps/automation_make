import { ValueObject } from '../../shared/value-objects/ValueObject';
import { ValidationError } from '../../shared/errors/ValidationError';

export class SubscriberName extends ValueObject {
  private constructor(private readonly value: string | null) {
    super();
  }

  static create(name: string | null | undefined): SubscriberName {
    if (!name || name.trim().length === 0) {
      return new SubscriberName(null);
    }

    const trimmed = name.trim();
    if (trimmed.length > 255) {
      throw new ValidationError('Name is too long (max 255 characters)');
    }

    return new SubscriberName(trimmed);
  }

  static createNull(): SubscriberName {
    return new SubscriberName(null);
  }

  getValue(): string | null {
    return this.value;
  }

  hasValue(): boolean {
    return this.value !== null;
  }

  protected equals(other: SubscriberName): boolean {
    return this.value === other.value;
  }
}
