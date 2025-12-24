import { Newsletter } from '../entities/Newsletter.entity';
import { UniqueId } from '../../shared/value-objects/UniqueId.vo';
import { ServiceName } from '../../feature-flag/value-objects/ServiceName.vo';

export interface PaginatedResult<T> {
  data: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface INewsletterRepository {
  findById(id: UniqueId): Promise<Newsletter | null>;
  findAll(cursor?: string, limit?: number, serviceName?: ServiceName): Promise<PaginatedResult<Newsletter>>;
}
