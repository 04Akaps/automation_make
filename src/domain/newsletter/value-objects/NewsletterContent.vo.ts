import { MultilingualContent, MultilingualText } from '../../shared/value-objects/MultilingualContent.vo';

export class NewsletterContent {
  private content: MultilingualContent;

  private constructor(content: MultilingualText) {
    this.content = MultilingualContent.create(content);
  }

  static create(content: MultilingualText): NewsletterContent {
    return new NewsletterContent(content);
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
