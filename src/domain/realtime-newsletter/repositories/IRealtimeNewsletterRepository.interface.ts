import { RealtimeNewsletter } from '../entities/RealtimeNewsletter.entity';
import { UniqueId } from '../../shared/value-objects/UniqueId.vo';
import { RealtimeNewsletterStatus } from '../value-objects/RealtimeNewsletterStatus.vo';

export interface IRealtimeNewsletterRepository {
  findById(id: UniqueId): Promise<RealtimeNewsletter | null>;
  findByStatus(status: RealtimeNewsletterStatus): Promise<RealtimeNewsletter[]>;
  updateStatus(id: UniqueId, status: RealtimeNewsletterStatus): Promise<void>;
}
