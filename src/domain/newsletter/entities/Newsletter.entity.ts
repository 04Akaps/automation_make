import { UniqueId } from '../../shared/value-objects/UniqueId.vo';
import { NewsletterTitle } from '../value-objects/NewsletterTitle.vo';
import { NewsletterContent } from '../value-objects/NewsletterContent.vo';
import { NewsletterStatus } from '../value-objects/NewsletterStatus.vo';
import { PublishedAt } from '../value-objects/PublishedAt.vo';
import { NewsletterTags } from '../value-objects/NewsletterTags.vo';

export interface NewsletterProps {
  id: UniqueId;
  title: NewsletterTitle;
  summary: NewsletterContent | null;
  content: NewsletterContent;
  status: NewsletterStatus;
  publishedAt: PublishedAt;
  domain: string | null;
  tags: NewsletterTags;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Newsletter {
  private constructor(
    public readonly id: UniqueId,
    public readonly title: NewsletterTitle,
    public readonly summary: NewsletterContent | null,
    public readonly content: NewsletterContent,
    public readonly status: NewsletterStatus,
    public readonly publishedAt: PublishedAt,
    public readonly domain: string | null,
    public readonly tags: NewsletterTags,
    public readonly imageUrl: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) { }

  static create(props: NewsletterProps): Newsletter {
    return new Newsletter(
      props.id,
      props.title,
      props.summary,
      props.content,
      props.status,
      props.publishedAt,
      props.domain,
      props.tags,
      props.imageUrl,
      props.createdAt,
      props.updatedAt
    );
  }

  isPublished(): boolean {
    return this.status.isPublished();
  }

  isInProgress(): boolean {
    return this.status.isProgress();
  }
}
