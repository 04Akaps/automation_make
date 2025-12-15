import { RowDataPacket } from 'mysql2';

export interface SubscriberRow extends RowDataPacket {
  id: number;
  email: string;
  name: string | null;
  status: 'active' | 'cancelled';
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscribed_at: Date | null;
  cancelled_at: Date | null;
  created_at: Date;
  updated_at: Date;
}
