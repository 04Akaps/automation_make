import { injectable, inject } from 'tsyringe';
import { ISubscriberRepository } from '../../../../domain/subscription/repositories/ISubscriberRepository.interface';
import { Subscriber } from '../../../../domain/subscription/entities/Subscriber.entity';
import { Email } from '../../../../domain/subscription/value-objects/Email.vo';
import { UniqueId } from '../../../../domain/shared/value-objects/UniqueId.vo';
import { StripeCustomerId } from '../../../../domain/subscription/value-objects/StripeCustomerId.vo';
import { DatabaseConnection } from '../connection/DatabaseConnection';
import { SubscriberPersistenceMapper } from '../mappers/SubscriberPersistenceMapper';
import { SubscriberRow } from '../types/SubscriberRow';

@injectable()
export class MySqlSubscriberRepository implements ISubscriberRepository {
  constructor(
    @inject(DatabaseConnection) private db: DatabaseConnection
  ) { }

  async findById(id: UniqueId): Promise<Subscriber | null> {
    const rows = await this.db.query<SubscriberRow[]>(
      'SELECT * FROM subscribers WHERE id = ?',
      [id.getValue()]
    );

    if (!rows || rows.length === 0) {
      return null;
    }

    return SubscriberPersistenceMapper.toDomain(rows[0]);
  }

  async findByEmail(email: Email): Promise<Subscriber | null> {
    const rows = await this.db.query<SubscriberRow[]>(
      'SELECT * FROM subscribers WHERE email = ?',
      [email.getValue()]
    );

    if (!rows || rows.length === 0) {
      return null;
    }

    return SubscriberPersistenceMapper.toDomain(rows[0]);
  }

  async findByStripeCustomerId(customerId: StripeCustomerId): Promise<Subscriber | null> {
    const rows = await this.db.query<SubscriberRow[]>(
      'SELECT * FROM subscribers WHERE stripe_customer_id = ?',
      [customerId.getValue()]
    );

    if (!rows || rows.length === 0) {
      return null;
    }

    return SubscriberPersistenceMapper.toDomain(rows[0]);
  }

  async findActiveSubscribers(): Promise<Subscriber[]> {
    const rows = await this.db.query<SubscriberRow[]>(
      'SELECT * FROM subscribers WHERE status = ?',
      ['active']
    );

    return rows.map(row => SubscriberPersistenceMapper.toDomain(row));
  }

  async save(subscriber: Subscriber): Promise<void> {
    const data = SubscriberPersistenceMapper.toPersistence(subscriber);

    await this.db.execute(
      `INSERT INTO subscribers
        (id, email, name, status, stripe_customer_id, stripe_subscription_id, subscribed_at, cancelled_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        status = VALUES(status),
        stripe_customer_id = VALUES(stripe_customer_id),
        stripe_subscription_id = VALUES(stripe_subscription_id),
        subscribed_at = VALUES(subscribed_at),
        cancelled_at = VALUES(cancelled_at)`,
      [
        data.id,
        data.email,
        data.name,
        data.status,
        data.stripe_customer_id,
        data.stripe_subscription_id,
        data.subscribed_at,
        data.cancelled_at,
      ]
    );
  }

  async create(subscriber: Subscriber): Promise<Subscriber> {
    const data = SubscriberPersistenceMapper.toPersistence(subscriber);

    const result = await this.db.execute(
      `INSERT INTO subscribers
        (email, name, status, stripe_customer_id, stripe_subscription_id, subscribed_at, cancelled_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.email,
        data.name,
        data.status,
        data.stripe_customer_id,
        data.stripe_subscription_id,
        data.subscribed_at,
        data.cancelled_at,
      ]
    );

    const createdSubscriber = await this.findById(UniqueId.create(result.insertId));
    if (!createdSubscriber) {
      throw new Error('Failed to retrieve created subscriber');
    }

    return createdSubscriber;
  }
}
