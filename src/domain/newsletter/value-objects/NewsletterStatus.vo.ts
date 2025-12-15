import { ValueObject } from '../../shared/value-objects/ValueObject';
import { ValidationError } from '../../shared/errors/ValidationError';

export type NewsletterStatusType = 'progress' | 'published';

export class NewsletterStatus extends ValueObject {
  private constructor(private readonly value: NewsletterStatusType) {
    super();
  }

  static create(value: NewsletterStatusType): NewsletterStatus {
    return new NewsletterStatus(value);
  }

  static progress(): NewsletterStatus {
    return new NewsletterStatus('progress');
  }

  static published(): NewsletterStatus {
    return new NewsletterStatus('published');
  }

  getValue(): NewsletterStatusType {
    return this.value;
  }

  isPublished(): boolean {
    return this.value === 'published';
  }

  isProgress(): boolean {
    return this.value === 'progress';
  }

  protected equals(other: NewsletterStatus): boolean {
    return this.value === other.value;
  }
}
