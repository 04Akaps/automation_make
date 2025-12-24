import { RowDataPacket } from 'mysql2';

export interface NewsletterRow extends RowDataPacket {
  id: number;
  title: string;
  summary: string | null;
  content: string;
  status: 'progress' | 'published';
  service_name: string;
  published_at: Date | null;
  domain: string | null;
  tags: string | null;
  image_url: string | null;
  created_at: Date;
  updated_at: Date;
}
