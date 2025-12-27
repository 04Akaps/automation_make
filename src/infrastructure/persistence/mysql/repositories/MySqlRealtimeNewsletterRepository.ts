import { injectable, inject } from 'tsyringe';
import { IRealtimeNewsletterRepository } from '../../../../domain/realtime-newsletter/repositories/IRealtimeNewsletterRepository.interface';
import { RealtimeNewsletter } from '../../../../domain/realtime-newsletter/entities/RealtimeNewsletter.entity';
import { UniqueId } from '../../../../domain/shared/value-objects/UniqueId.vo';
import { RealtimeNewsletterStatus } from '../../../../domain/realtime-newsletter/value-objects/RealtimeNewsletterStatus.vo';
import { DatabaseConnection } from '../connection/DatabaseConnection';
import { RealtimeNewsletterPersistenceMapper } from '../mappers/RealtimeNewsletterPersistenceMapper';
import { RealtimeNewsletterRow } from '../types/RealtimeNewsletterRow';

@injectable()
export class MySqlRealtimeNewsletterRepository implements IRealtimeNewsletterRepository {
  constructor(
    @inject(DatabaseConnection) private db: DatabaseConnection
  ) {}

  async findById(id: UniqueId): Promise<RealtimeNewsletter | null> {
    const rows = await this.db.query<RealtimeNewsletterRow[]>(
      'SELECT * FROM realtime_newsletters WHERE id = ?',
      [id.getValue()]
    );

    if (!rows || rows.length === 0) {
      return null;
    }

    return RealtimeNewsletterPersistenceMapper.toDomain(rows[0]);
  }

  async findByStatus(status: RealtimeNewsletterStatus): Promise<RealtimeNewsletter[]> {
    const rows = await this.db.query<RealtimeNewsletterRow[]>(
      'SELECT * FROM realtime_newsletters WHERE status = ? ORDER BY id ASC',
      [status.getValue()]
    );

    return rows.map(row => RealtimeNewsletterPersistenceMapper.toDomain(row));
  }

  async updateStatus(id: UniqueId, status: RealtimeNewsletterStatus): Promise<void> {
    await this.db.execute(
      'UPDATE realtime_newsletters SET status = ?, updated_at = NOW() WHERE id = ?',
      [status.getValue(), id.getValue()]
    );
  }
}
