import { UniqueId } from '../../shared/value-objects/UniqueId.vo';
import { NewsletterContent } from '../../newsletter/value-objects/NewsletterContent.vo';
import { NewsletterTitle } from '../../newsletter/value-objects/NewsletterTitle.vo';
import { NewsletterTags } from '../../newsletter/value-objects/NewsletterTags.vo';
import { PublishedAt } from '../../newsletter/value-objects/PublishedAt.vo';
import { RealtimeNewsletterStatus } from '../value-objects/RealtimeNewsletterStatus.vo';

export interface RealtimeNewsletterProps {
  id: UniqueId;
  title: NewsletterTitle;
  summary: NewsletterContent | null;
  content: NewsletterContent;
  publishedAt: PublishedAt;
  domain: string | null;
  tags: NewsletterTags;
  status: RealtimeNewsletterStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class RealtimeNewsletter {
  private constructor(
    public readonly id: UniqueId,
    public readonly title: NewsletterTitle,
    public readonly summary: NewsletterContent | null,
    public readonly content: NewsletterContent,
    public readonly publishedAt: PublishedAt,
    public readonly domain: string | null,
    public readonly tags: NewsletterTags,
    private _status: RealtimeNewsletterStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(props: RealtimeNewsletterProps): RealtimeNewsletter {
    return new RealtimeNewsletter(
      props.id,
      props.title,
      props.summary,
      props.content,
      props.publishedAt,
      props.domain,
      props.tags,
      props.status,
      props.createdAt,
      props.updatedAt
    );
  }

  get status(): RealtimeNewsletterStatus {
    return this._status;
  }

  isPending(): boolean {
    return this._status.isPending();
  }

  isProcessing(): boolean {
    return this._status.isProcessing();
  }

  isCompleted(): boolean {
    return this._status.isCompleted();
  }

  markAsProcessing(): void {
    this._status = RealtimeNewsletterStatus.createProcessing();
  }

  markAsCompleted(): void {
    this._status = RealtimeNewsletterStatus.createCompleted();
  }
}
