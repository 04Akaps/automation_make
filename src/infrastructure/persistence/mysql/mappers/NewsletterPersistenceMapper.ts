import { Newsletter, NewsletterProps } from '../../../../domain/newsletter/entities/Newsletter.entity';
import { UniqueId } from '../../../../domain/shared/value-objects/UniqueId.vo';
import { NewsletterTitle } from '../../../../domain/newsletter/value-objects/NewsletterTitle.vo';
import { NewsletterContent } from '../../../../domain/newsletter/value-objects/NewsletterContent.vo';
import { NewsletterStatus } from '../../../../domain/newsletter/value-objects/NewsletterStatus.vo';
import { PublishedAt } from '../../../../domain/newsletter/value-objects/PublishedAt.vo';
import { NewsletterTags } from '../../../../domain/newsletter/value-objects/NewsletterTags.vo';
import { ServiceName } from '../../../../domain/feature-flag/value-objects/ServiceName.vo';
import { NewsletterRow } from '../types/NewsletterRow';

export class NewsletterPersistenceMapper {
  static toDomain(row: NewsletterRow): Newsletter {
    const titleData = typeof row.title === 'string' ? JSON.parse(row.title) : row.title;
    const contentData = typeof row.content === 'string' ? JSON.parse(row.content) : row.content;
    const summaryData = row.summary ? (typeof row.summary === 'string' ? JSON.parse(row.summary) : row.summary) : null;
    const tagsData = row.tags ? (typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags) : null;

    const props: NewsletterProps = {
      id: UniqueId.create(row.id),
      title: NewsletterTitle.create(titleData),
      summary: summaryData ? NewsletterContent.create(summaryData) : null,
      content: NewsletterContent.create(contentData),
      status: NewsletterStatus.create(row.status),
      serviceName: ServiceName.create(row.service_name),
      publishedAt: PublishedAt.create(row.published_at),
      domain: row.domain,
      tags: NewsletterTags.create(tagsData),
      imageUrl: row.image_url,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };

    return Newsletter.create(props);
  }

  static toPersistence(entity: Newsletter): any {
    return {
      id: Number(entity.id.getValue()),
      title: JSON.stringify(entity.title.getValue()),
      summary: entity.summary ? JSON.stringify(entity.summary.getValue()) : null,
      content: JSON.stringify(entity.content.getValue()),
      status: entity.status.getValue(),
      service_name: entity.serviceName.getValue(),
      published_at: entity.publishedAt.getValue(),
      domain: entity.domain,
      tags: entity.tags.isEmpty() ? null : JSON.stringify(entity.tags.getValue()),
      image_url: entity.imageUrl,
    };
  }
}
