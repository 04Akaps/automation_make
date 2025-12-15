import { MultilingualContent, MultilingualText } from '../../shared/value-objects/MultilingualContent.vo';

export class NewsletterTitle {
  private content: MultilingualContent;

  private constructor(content: MultilingualText) {
    this.content = MultilingualContent.create(content);
  }

  static create(content: MultilingualText): NewsletterTitle {
    return new NewsletterTitle(content);
  }

  getValue(): MultilingualText {
    return this.content.getValue();
  }

  getEnglish(): string | null {
    return this.content.getEnglish();
  }

  getKorean(): string | null {
    return this.content.getKorean();
  }
}
