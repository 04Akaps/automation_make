import { UniqueId } from '../../shared/value-objects/UniqueId.vo';
import { DeliveryStatus } from '../value-objects/DeliveryStatus.vo';
import { ValidationError } from '../../shared/errors/ValidationError';

export interface NewsletterDeliveryProps {
  id: UniqueId;
  realtimeNewsletterId: UniqueId;
  subscriberId: UniqueId;
  status: DeliveryStatus;
  sentAt: Date | null;
  errorMessage: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class NewsletterDelivery {
  private constructor(
    public readonly id: UniqueId,
    public readonly realtimeNewsletterId: UniqueId,
    public readonly subscriberId: UniqueId,
    private _status: DeliveryStatus,
    private _sentAt: Date | null,
    private _errorMessage: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(props: NewsletterDeliveryProps): NewsletterDelivery {
    return new NewsletterDelivery(
      props.id,
      props.realtimeNewsletterId,
      props.subscriberId,
      props.status,
      props.sentAt,
      props.errorMessage,
      props.createdAt,
      props.updatedAt
    );
  }

  static createNew(
    realtimeNewsletterId: UniqueId,
    subscriberId: UniqueId
  ): NewsletterDelivery {
    return new NewsletterDelivery(
      UniqueId.create(0), // Will be set by DB
      realtimeNewsletterId,
      subscriberId,
      DeliveryStatus.createPending(),
      null,
      null,
      new Date(),
      new Date()
    );
  }

  get status(): DeliveryStatus {
    return this._status;
  }

  get sentAt(): Date | null {
    return this._sentAt;
  }

  get errorMessage(): string | null {
    return this._errorMessage;
  }

  isPending(): boolean {
    return this._status.isPending();
  }

  isSent(): boolean {
    return this._status.isSent();
  }

  isFailed(): boolean {
    return this._status.isFailed();
  }

  markAsSent(): void {
    if (!this.isPending()) {
      throw new ValidationError('Can only mark pending deliveries as sent');
    }
    this._status = DeliveryStatus.createSent();
    this._sentAt = new Date();
    this._errorMessage = null;
  }

  markAsFailed(errorMessage: string): void {
    if (!this.isPending()) {
      throw new ValidationError('Can only mark pending deliveries as failed');
    }
    this._status = DeliveryStatus.createFailed();
    this._errorMessage = errorMessage;
  }
}
