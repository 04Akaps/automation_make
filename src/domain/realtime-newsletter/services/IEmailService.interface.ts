import { RealtimeNewsletter } from '../entities/RealtimeNewsletter.entity';

export interface IEmailService {
  sendNewsletter(email: string, newsletter: RealtimeNewsletter): Promise<void>;
  sendNewsletterBatch(emails: string[], newsletter: RealtimeNewsletter): Promise<void>;
}
