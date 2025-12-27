import { RowDataPacket } from 'mysql2';

export interface NewsletterDeliveryRow extends RowDataPacket {
  id: number;
  realtime_newsletter_id: number;
  subscriber_id: number;
  status: 'pending' | 'sent' | 'failed';
  sent_at: Date | null;
  error_message: string | null;
  created_at: Date;
  updated_at: Date;
}
