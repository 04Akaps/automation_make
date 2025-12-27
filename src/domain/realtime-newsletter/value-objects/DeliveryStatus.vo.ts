import { ValueObject } from '../../shared/value-objects/ValueObject';
import { ValidationError } from '../../shared/errors/ValidationError';

type StatusValue = 'pending' | 'sent' | 'failed';

export class DeliveryStatus extends ValueObject {
  private constructor(private readonly value: StatusValue) {
    super();
    this.validate();
  }

  static create(value: StatusValue): DeliveryStatus {
    return new DeliveryStatus(value);
  }

  static createPending(): DeliveryStatus {
    return new DeliveryStatus('pending');
  }

  static createSent(): DeliveryStatus {
    return new DeliveryStatus('sent');
  }

  static createFailed(): DeliveryStatus {
    return new DeliveryStatus('failed');
  }

  private validate(): void {
    const validStatuses: StatusValue[] = ['pending', 'sent', 'failed'];
    if (!validStatuses.includes(this.value)) {
      throw new ValidationError(`Invalid delivery status: ${this.value}`);
    }
  }

  getValue(): StatusValue {
    return this.value;
  }

  isPending(): boolean {
    return this.value === 'pending';
  }

  isSent(): boolean {
    return this.value === 'sent';
  }

  isFailed(): boolean {
    return this.value === 'failed';
  }

  protected equals(other: DeliveryStatus): boolean {
    return this.value === other.value;
  }
}
