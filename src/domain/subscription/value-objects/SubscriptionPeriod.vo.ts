import { ValueObject } from '../../shared/value-objects/ValueObject';
import { ValidationError } from '../../shared/errors/ValidationError';

export class SubscriptionPeriod extends ValueObject {
  private constructor(
    private readonly start: Date,
    private readonly end: Date | null
  ) {
    super();
    this.validate();
  }

  static create(start: Date, end: Date | null): SubscriptionPeriod {
    return new SubscriptionPeriod(start, end);
  }

  static createFromTimestamps(startTimestamp: number, endTimestamp: number | null): SubscriptionPeriod {
    const start = new Date(startTimestamp * 1000);
    const end = endTimestamp ? new Date(endTimestamp * 1000) : null;
    return new SubscriptionPeriod(start, end);
  }

  private validate(): void {
    if (isNaN(this.start.getTime())) {
      throw new ValidationError('Invalid start date');
    }

    if (this.end && isNaN(this.end.getTime())) {
      throw new ValidationError('Invalid end date');
    }

    if (this.end && this.end < this.start) {
      throw new ValidationError('End date cannot be before start date');
    }
  }

  getStart(): Date {
    return this.start;
  }

  getEnd(): Date | null {
    return this.end;
  }

  isActive(): boolean {
    const now = new Date();
    if (!this.end) {
      return true;
    }
    return now >= this.start && now <= this.end;
  }

  protected equals(other: SubscriptionPeriod): boolean {
    const startEquals = this.start.getTime() === other.start.getTime();
    const endEquals =
      (this.end === null && other.end === null) ||
      (this.end !== null && other.end !== null && this.end.getTime() === other.end.getTime());

    return startEquals && endEquals;
  }
}
