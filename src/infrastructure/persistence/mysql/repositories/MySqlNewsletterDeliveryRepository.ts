import { injectable, inject } from 'tsyringe';
import { INewsletterDeliveryRepository } from '../../../../domain/realtime-newsletter/repositories/INewsletterDeliveryRepository.interface';
import { NewsletterDelivery } from '../../../../domain/realtime-newsletter/entities/NewsletterDelivery.entity';
import { UniqueId } from '../../../../domain/shared/value-objects/UniqueId.vo';
import { DeliveryStatus } from '../../../../domain/realtime-newsletter/value-objects/DeliveryStatus.vo';
import { DatabaseConnection } from '../connection/DatabaseConnection';
import { NewsletterDeliveryPersistenceMapper } from '../mappers/NewsletterDeliveryPersistenceMapper';
import { NewsletterDeliveryRow } from '../types/NewsletterDeliveryRow';

@injectable()
export class MySqlNewsletterDeliveryRepository implements INewsletterDeliveryRepository {
  constructor(
    @inject(DatabaseConnection) private db: DatabaseConnection
  ) {}

  async findById(id: UniqueId): Promise<NewsletterDelivery | null> {
    const rows = await this.db.query<NewsletterDeliveryRow[]>(
      'SELECT * FROM newsletter_deliveries WHERE id = ?',
      [id.getValue()]
    );

    if (!rows || rows.length === 0) {
      return null;
    }

    return NewsletterDeliveryPersistenceMapper.toDomain(rows[0]);
  }

  async findByNewsletterId(newsletterId: UniqueId): Promise<NewsletterDelivery[]> {
    const rows = await this.db.query<NewsletterDeliveryRow[]>(
      'SELECT * FROM newsletter_deliveries WHERE realtime_newsletter_id = ?',
      [newsletterId.getValue()]
    );

    return rows.map(row => NewsletterDeliveryPersistenceMapper.toDomain(row));
  }

  async findPendingByNewsletterId(newsletterId: UniqueId): Promise<NewsletterDelivery[]> {
    const rows = await this.db.query<NewsletterDeliveryRow[]>(
      'SELECT * FROM newsletter_deliveries WHERE realtime_newsletter_id = ? AND status = ?',
      [newsletterId.getValue(), 'pending']
    );

    return rows.map(row => NewsletterDeliveryPersistenceMapper.toDomain(row));
  }

  async bulkCreate(deliveries: NewsletterDelivery[]): Promise<void> {
    if (deliveries.length === 0) return;

    const values = deliveries.map(d => [
      Number(d.realtimeNewsletterId.getValue()),
      Number(d.subscriberId.getValue()),
      d.status.getValue()
    ]);

    const placeholders = values.map(() => '(?, ?, ?)').join(', ');
    const flatValues = values.flat();

    await this.db.execute(
      `INSERT IGNORE INTO newsletter_deliveries
       (realtime_newsletter_id, subscriber_id, status)
       VALUES ${placeholders}`,
      flatValues
    );
  }

  async updateStatus(
    id: UniqueId,
    status: DeliveryStatus,
    sentAt?: Date | null,
    errorMessage?: string | null
  ): Promise<void> {
    await this.db.execute(
      `UPDATE newsletter_deliveries
       SET status = ?, sent_at = ?, error_message = ?, updated_at = NOW()
       WHERE id = ?`,
      [status.getValue(), sentAt || null, errorMessage || null, id.getValue()]
    );
  }
}
