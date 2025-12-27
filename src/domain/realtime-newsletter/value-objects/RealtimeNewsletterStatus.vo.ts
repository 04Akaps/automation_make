import { ValueObject } from '../../shared/value-objects/ValueObject';
import { ValidationError } from '../../shared/errors/ValidationError';

type StatusValue = 'pending' | 'processing' | 'completed';

export class RealtimeNewsletterStatus extends ValueObject {
  private constructor(private readonly value: StatusValue) {
    super();
    this.validate();
  }

  static create(value: StatusValue): RealtimeNewsletterStatus {
    return new RealtimeNewsletterStatus(value);
  }

  static createPending(): RealtimeNewsletterStatus {
    return new RealtimeNewsletterStatus('pending');
  }

  static createProcessing(): RealtimeNewsletterStatus {
    return new RealtimeNewsletterStatus('processing');
  }

  static createCompleted(): RealtimeNewsletterStatus {
    return new RealtimeNewsletterStatus('completed');
  }

  private validate(): void {
    const validStatuses: StatusValue[] = ['pending', 'processing', 'completed'];
    if (!validStatuses.includes(this.value)) {
      throw new ValidationError(`Invalid realtime newsletter status: ${this.value}`);
    }
  }

  getValue(): StatusValue {
    return this.value;
  }

  isPending(): boolean {
    return this.value === 'pending';
  }

  isProcessing(): boolean {
    return this.value === 'processing';
  }

  isCompleted(): boolean {
    return this.value === 'completed';
  }

  protected equals(other: RealtimeNewsletterStatus): boolean {
    return this.value === other.value;
  }
}
