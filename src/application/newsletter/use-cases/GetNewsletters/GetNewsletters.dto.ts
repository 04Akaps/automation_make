export interface GetNewslettersInputDto {
  cursor?: string;
  limit?: number;
  serviceName?: string;
}

export interface NewsletterDto {
  id: string | number;
  title: {
    en?: string;
    ko?: string;
  };
  summary: {
    en?: string;
    ko?: string;
  } | null;
  content: {
    en?: string;
    ko?: string;
  };
  status: string;
  serviceName: string;
  publishedAt: string | null;
  domain: string | null;
  tags: string[];
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetNewslettersOutputDto {
  data: NewsletterDto[];
  nextCursor: string | null;
  hasMore: boolean;
}
