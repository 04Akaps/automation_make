import { NewsletterDelivery, NewsletterDeliveryProps } from '../../../../domain/realtime-newsletter/entities/NewsletterDelivery.entity';
import { UniqueId } from '../../../../domain/shared/value-objects/UniqueId.vo';
import { DeliveryStatus } from '../../../../domain/realtime-newsletter/value-objects/DeliveryStatus.vo';
import { NewsletterDeliveryRow } from '../types/NewsletterDeliveryRow';

export class NewsletterDeliveryPersistenceMapper {
  static toDomain(row: NewsletterDeliveryRow): NewsletterDelivery {
    const props: NewsletterDeliveryProps = {
      id: UniqueId.create(row.id),
      realtimeNewsletterId: UniqueId.create(row.realtime_newsletter_id),
      subscriberId: UniqueId.create(row.subscriber_id),
      status: DeliveryStatus.create(row.status),
      sentAt: row.sent_at,
      errorMessage: row.error_message,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };

    return NewsletterDelivery.create(props);
  }

  static toPersistence(entity: NewsletterDelivery): any {
    return {
      realtime_newsletter_id: Number(entity.realtimeNewsletterId.getValue()),
      subscriber_id: Number(entity.subscriberId.getValue()),
      status: entity.status.getValue(),
      sent_at: entity.sentAt,
      error_message: entity.errorMessage,
    };
  }
}
