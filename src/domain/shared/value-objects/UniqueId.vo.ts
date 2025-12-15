import { ValueObject } from './ValueObject';
import { ValidationError } from '../errors/ValidationError';

export class UniqueId extends ValueObject {
  private constructor(private readonly value: string | number) {
    super();
    this.validate(value);
  }

  static create(value: string | number): UniqueId {
    return new UniqueId(value);
  }

  private validate(value: string | number): void {
    if (value === null || value === undefined) {
      throw new ValidationError('ID cannot be null or undefined');
    }

    if (typeof value === 'string' && value.trim().length === 0) {
      throw new ValidationError('ID cannot be empty');
    }

    if (typeof value === 'number' && value <= 0) {
      throw new ValidationError('ID must be a positive number');
    }
  }

  getValue(): string | number {
    return this.value;
  }

  toString(): string {
    return String(this.value);
  }

  protected equals(other: UniqueId): boolean {
    return this.value === other.value;
  }
}
