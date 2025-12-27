import { RealtimeNewsletter, RealtimeNewsletterProps } from '../../../../domain/realtime-newsletter/entities/RealtimeNewsletter.entity';
import { UniqueId } from '../../../../domain/shared/value-objects/UniqueId.vo';
import { NewsletterTitle } from '../../../../domain/newsletter/value-objects/NewsletterTitle.vo';
import { NewsletterContent } from '../../../../domain/newsletter/value-objects/NewsletterContent.vo';
import { PublishedAt } from '../../../../domain/newsletter/value-objects/PublishedAt.vo';
import { NewsletterTags } from '../../../../domain/newsletter/value-objects/NewsletterTags.vo';
import { RealtimeNewsletterStatus } from '../../../../domain/realtime-newsletter/value-objects/RealtimeNewsletterStatus.vo';
import { RealtimeNewsletterRow } from '../types/RealtimeNewsletterRow';

export class RealtimeNewsletterPersistenceMapper {
  static toDomain(row: RealtimeNewsletterRow): RealtimeNewsletter {
    const titleData = typeof row.title === 'string' ? JSON.parse(row.title) : row.title;
    const contentData = typeof row.content === 'string' ? JSON.parse(row.content) : row.content;
    const summaryData = row.summary ? (typeof row.summary === 'string' ? JSON.parse(row.summary) : row.summary) : null;
    const tagsData = row.tags ? (typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags) : null;

    const props: RealtimeNewsletterProps = {
      id: UniqueId.create(row.id),
      title: NewsletterTitle.create(titleData),
      summary: summaryData ? NewsletterContent.create(summaryData) : null,
      content: NewsletterContent.create(contentData),
      publishedAt: PublishedAt.create(row.published_at),
      domain: row.domain,
      tags: NewsletterTags.create(tagsData),
      status: RealtimeNewsletterStatus.create(row.status),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };

    return RealtimeNewsletter.create(props);
  }
}
