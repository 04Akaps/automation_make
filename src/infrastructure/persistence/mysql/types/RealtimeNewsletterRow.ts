import { RowDataPacket } from 'mysql2';

export interface RealtimeNewsletterRow extends RowDataPacket {
  id: number;
  title: string;
  summary: string | null;
  content: string;
  published_at: Date | null;
  domain: string | null;
  tags: string | null;
  status: 'pending' | 'processing' | 'completed';
  created_at: Date;
  updated_at: Date;
}
