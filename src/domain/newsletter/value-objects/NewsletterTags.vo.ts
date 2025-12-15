import { ValueObject } from '../../shared/value-objects/ValueObject';

export class NewsletterTags extends ValueObject {
  private constructor(private readonly tags: string[]) {
    super();
  }

  static create(tags: string[] | null): NewsletterTags {
    if (!tags || tags.length === 0) {
      return new NewsletterTags([]);
    }

    const uniqueTags = Array.from(new Set(tags.map(tag => tag.trim().toLowerCase())));
    return new NewsletterTags(uniqueTags);
  }

  static createEmpty(): NewsletterTags {
    return new NewsletterTags([]);
  }

  getValue(): string[] {
    return [...this.tags];
  }

  isEmpty(): boolean {
    return this.tags.length === 0;
  }

  contains(tag: string): boolean {
    return this.tags.includes(tag.trim().toLowerCase());
  }

  protected equals(other: NewsletterTags): boolean {
    if (this.tags.length !== other.tags.length) {
      return false;
    }

    return this.tags.every((tag, index) => tag === other.tags[index]);
  }
}
