import { NewsletterDelivery } from '../entities/NewsletterDelivery.entity';
import { UniqueId } from '../../shared/value-objects/UniqueId.vo';
import { DeliveryStatus } from '../value-objects/DeliveryStatus.vo';

export interface INewsletterDeliveryRepository {
  findById(id: UniqueId): Promise<NewsletterDelivery | null>;
  findByNewsletterId(newsletterId: UniqueId): Promise<NewsletterDelivery[]>;
  findPendingByNewsletterId(newsletterId: UniqueId): Promise<NewsletterDelivery[]>;
  bulkCreate(deliveries: NewsletterDelivery[]): Promise<void>;
  updateStatus(
    id: UniqueId,
    status: DeliveryStatus,
    sentAt?: Date | null,
    errorMessage?: string | null
  ): Promise<void>;
}
