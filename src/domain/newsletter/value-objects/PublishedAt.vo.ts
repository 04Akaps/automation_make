import { ValueObject } from '../../shared/value-objects/ValueObject';
import { ValidationError } from '../../shared/errors/ValidationError';

export class PublishedAt extends ValueObject {
  private constructor(private readonly value: Date | null) {
    super();
  }

  static create(value: Date | string | null): PublishedAt {
    if (value === null) {
      return new PublishedAt(null);
    }

    const date = value instanceof Date ? value : new Date(value);

    if (isNaN(date.getTime())) {
      throw new ValidationError('Invalid date format');
    }

    return new PublishedAt(date);
  }

  static createNull(): PublishedAt {
    return new PublishedAt(null);
  }

  getValue(): Date | null {
    return this.value;
  }

  isPublished(): boolean {
    return this.value !== null;
  }

  toISOString(): string | null {
    return this.value ? this.value.toISOString() : null;
  }

  protected equals(other: PublishedAt): boolean {
    if (this.value === null && other.value === null) {
      return true;
    }

    if (this.value === null || other.value === null) {
      return false;
    }

    return this.value.getTime() === other.value.getTime();
  }
}
