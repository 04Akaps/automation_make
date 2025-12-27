import { Newsletter } from '../entities/Newsletter.entity';
import { UniqueId } from '../../shared/value-objects/UniqueId.vo';

export interface PaginatedResult<T> {
  data: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface INewsletterRepository {
  findById(id: UniqueId): Promise<Newsletter | null>;
  findAll(cursor?: string, limit?: number): Promise<PaginatedResult<Newsletter>>;
}
