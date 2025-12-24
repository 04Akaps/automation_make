import { injectable, inject } from 'tsyringe';
import { INewsletterRepository, PaginatedResult } from '../../../../domain/newsletter/repositories/INewsletterRepository.interface';
import { Newsletter } from '../../../../domain/newsletter/entities/Newsletter.entity';
import { UniqueId } from '../../../../domain/shared/value-objects/UniqueId.vo';
import { ServiceName } from '../../../../domain/feature-flag/value-objects/ServiceName.vo';
import { DatabaseConnection } from '../connection/DatabaseConnection';
import { NewsletterPersistenceMapper } from '../mappers/NewsletterPersistenceMapper';
import { NewsletterRow } from '../types/NewsletterRow';

@injectable()
export class MySqlNewsletterRepository implements INewsletterRepository {
  constructor(
    @inject(DatabaseConnection) private db: DatabaseConnection
  ) {}

  async findById(id: UniqueId): Promise<Newsletter | null> {
    const rows = await this.db.query<NewsletterRow[]>(
      'SELECT * FROM newsletters WHERE id = ?',
      [id.getValue()]
    );

    if (!rows || rows.length === 0) {
      return null;
    }

    return NewsletterPersistenceMapper.toDomain(rows[0]);
  }

  async findAll(cursor?: string, limit: number = 10, serviceName?: ServiceName): Promise<PaginatedResult<Newsletter>> {
    let query = 'SELECT * FROM newsletters WHERE status = ? ';
    const params: any[] = ['published'];

    if (serviceName) {
      query += 'AND service_name = ? ';
      params.push(serviceName.getValue());
    }

    if (cursor) {
      query += 'AND id < ? ';
      params.push(cursor);
    }

    query += 'ORDER BY id DESC LIMIT ?';
    params.push(limit + 1);

    const rows = await this.db.query<NewsletterRow[]>(query, params);

    const hasMore = rows.length > limit;
    const data = rows.slice(0, limit).map(row => NewsletterPersistenceMapper.toDomain(row));
    const nextCursor = hasMore && data.length > 0 ? data[data.length - 1].id.toString() : null;

    return {
      data,
      nextCursor,
      hasMore,
    };
  }
}
