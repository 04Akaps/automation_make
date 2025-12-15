import { Subscriber } from '../entities/Subscriber.entity';
import { Email } from '../value-objects/Email.vo';
import { UniqueId } from '../../shared/value-objects/UniqueId.vo';
import { StripeCustomerId } from '../value-objects/StripeCustomerId.vo';

export interface ISubscriberRepository {
  findById(id: UniqueId): Promise<Subscriber | null>;
  findByEmail(email: Email): Promise<Subscriber | null>;
  findByStripeCustomerId(customerId: StripeCustomerId): Promise<Subscriber | null>;
  findActiveSubscribers(): Promise<Subscriber[]>;
  save(subscriber: Subscriber): Promise<void>;
  create(subscriber: Subscriber): Promise<Subscriber>;
}
