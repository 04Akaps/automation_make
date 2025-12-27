import { injectable } from 'tsyringe';
import nodemailer, { Transporter } from 'nodemailer';
import { IEmailService } from '../../domain/realtime-newsletter/services/IEmailService.interface';
import { RealtimeNewsletter } from '../../domain/realtime-newsletter/entities/RealtimeNewsletter.entity';
import { generateNewsletterHtml, generateNewsletterText } from './templates/newsletter-template';

@injectable()
export class NodemailerEmailService implements IEmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendNewsletter(email: string, newsletter: RealtimeNewsletter): Promise<void> {
    const language = 'ko';
    const title = newsletter.title.getValue()[language] || newsletter.title.getValue().en || 'Newsletter';

    await this.transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || 'Crypto Newsletter'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      to: email,
      subject: title,
      text: generateNewsletterText(newsletter, language),
      html: generateNewsletterHtml(newsletter, language),
    });
  }

  async sendNewsletterBatch(emails: string[], newsletter: RealtimeNewsletter): Promise<void> {
    if (emails.length === 0) return;

    const language = 'ko';
    const title = newsletter.title.getValue()[language] || newsletter.title.getValue().en || 'Newsletter';

    await this.transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || 'Crypto Newsletter'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      bcc: emails,
      subject: title,
      text: generateNewsletterText(newsletter, language),
      html: generateNewsletterHtml(newsletter, language),
    });
  }
}
