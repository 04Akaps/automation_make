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
  private constructor(private readonly props: NewsletterProps) {}

  static create(props: NewsletterProps): Newsletter {
    return new Newsletter(props);
  }

  get id(): UniqueId {
    return this.props.id;
  }

  get title(): NewsletterTitle {
    return this.props.title;
  }

  get summary(): NewsletterContent | null {
    return this.props.summary;
  }

  get content(): NewsletterContent {
    return this.props.content;
  }

  get status(): NewsletterStatus {
    return this.props.status;
  }

  get publishedAt(): PublishedAt {
    return this.props.publishedAt;
  }

  get domain(): string | null {
    return this.props.domain;
  }

  get tags(): NewsletterTags {
    return this.props.tags;
  }

  get imageUrl(): string | null {
    return this.props.imageUrl;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  isPublished(): boolean {
    return this.props.status.isPublished();
  }

  isInProgress(): boolean {
    return this.props.status.isProgress();
  }
}
