import { ValueObject } from '../../shared/value-objects/ValueObject';
import { ValidationError } from '../../shared/errors/ValidationError';

export class Email extends ValueObject {
  private constructor(private readonly value: string) {
    super();
    this.validate(value);
  }

  static create(email: string): Email {
    const normalized = email.toLowerCase().trim();
    return new Email(normalized);
  }

  private validate(email: string): void {
    if (!email || email.trim().length === 0) {
      throw new ValidationError('Email cannot be empty');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationError('Invalid email format');
    }
  }

  getValue(): string {
    return this.value;
  }

  toString(): string {
    return this.value;
  }

  protected equals(other: Email): boolean {
    return this.value === other.value;
  }
}
