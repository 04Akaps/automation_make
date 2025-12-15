import { ValueObject } from './ValueObject';
import { ValidationError } from '../errors/ValidationError';

export interface MultilingualText {
  en?: string;
  ko?: string;
}

export class MultilingualContent extends ValueObject {
  private constructor(
    private readonly en: string | null,
    private readonly ko: string | null
  ) {
    super();
    this.validate();
  }

  static create(content: MultilingualText): MultilingualContent {
    return new MultilingualContent(
      content.en || null,
      content.ko || null
    );
  }

  static createFromString(content: string, language: 'en' | 'ko'): MultilingualContent {
    if (language === 'en') {
      return new MultilingualContent(content, null);
    } else {
      return new MultilingualContent(null, content);
    }
  }

  private validate(): void {
    if (!this.en && !this.ko) {
      throw new ValidationError('At least one language must be provided');
    }
  }

  getEnglish(): string | null {
    return this.en;
  }

  getKorean(): string | null {
    return this.ko;
  }

  getValue(): MultilingualText {
    return {
      en: this.en || undefined,
      ko: this.ko || undefined
    };
  }

  hasEnglish(): boolean {
    return this.en !== null && this.en.length > 0;
  }

  hasKorean(): boolean {
    return this.ko !== null && this.ko.length > 0;
  }

  protected equals(other: MultilingualContent): boolean {
    return this.en === other.en && this.ko === other.ko;
  }
}
