import { ValueObject } from '../../shared/value-objects/ValueObject';
import { ValidationError } from '../../shared/errors/ValidationError';

export class ServiceName extends ValueObject {
  private constructor(private readonly value: string) {
    super();
  }

  static create(value: string): ServiceName {
    if (!value || value.trim().length === 0) {
      throw new ValidationError('Service name cannot be empty');
    }

    if (value.length > 100) {
      throw new ValidationError('Service name cannot exceed 100 characters');
    }

    return new ServiceName(value.trim());
  }

  getValue(): string {
    return this.value;
  }

  protected equals(other: ServiceName): boolean {
    return this.value === other.value;
  }
}
