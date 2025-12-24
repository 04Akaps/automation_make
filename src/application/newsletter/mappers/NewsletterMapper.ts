import { Newsletter } from '../../../domain/newsletter/entities/Newsletter.entity';
import { NewsletterDto } from '../use-cases/GetNewsletters/GetNewsletters.dto';

export class NewsletterMapper {
  static toDto(entity: Newsletter): NewsletterDto {
    return {
      id: entity.id.getValue(),
      title: entity.title.getValue(),
      summary: entity.summary ? entity.summary.getValue() : null,
      content: entity.content.getValue(),
      status: entity.status.getValue(),
      serviceName: entity.serviceName.getValue(),
      publishedAt: entity.publishedAt.toISOString(),
      domain: entity.domain,
      tags: entity.tags.getValue(),
      imageUrl: entity.imageUrl,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }
}
