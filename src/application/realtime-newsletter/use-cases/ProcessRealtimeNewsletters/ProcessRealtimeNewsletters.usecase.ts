import { injectable, inject } from 'tsyringe';
import winston from 'winston';
import { IRealtimeNewsletterRepository } from '../../../../domain/realtime-newsletter/repositories/IRealtimeNewsletterRepository.interface';
import { INewsletterDeliveryRepository } from '../../../../domain/realtime-newsletter/repositories/INewsletterDeliveryRepository.interface';
import { ISubscriberRepository } from '../../../../domain/subscription/repositories/ISubscriberRepository.interface';
import { IEmailService } from '../../../../domain/realtime-newsletter/services/IEmailService.interface';
import { RealtimeNewsletterStatus } from '../../../../domain/realtime-newsletter/value-objects/RealtimeNewsletterStatus.vo';
import { NewsletterDelivery } from '../../../../domain/realtime-newsletter/entities/NewsletterDelivery.entity';
import { SubscriptionStatus } from '../../../../domain/subscription/value-objects/SubscriptionStatus.vo';
import { Subscriber } from '../../../../domain/subscription/entities/Subscriber.entity';

@injectable()
export class ProcessRealtimeNewslettersUseCase {
  private readonly BATCH_SIZE = 10;

  constructor(
    @inject('IRealtimeNewsletterRepository')
    private newsletterRepo: IRealtimeNewsletterRepository,
    @inject('INewsletterDeliveryRepository')
    private deliveryRepo: INewsletterDeliveryRepository,
    @inject('ISubscriberRepository')
    private subscriberRepo: ISubscriberRepository,
    @inject('IEmailService')
    private emailService: IEmailService,
    @inject('Logger')
    private logger: winston.Logger
  ) {}

  async execute(): Promise<void> {
    const pendingNewsletters = await this.newsletterRepo.findByStatus(
      RealtimeNewsletterStatus.createPending()
    );

    if (pendingNewsletters.length === 0) {
      this.logger.info({
        location: 'ProcessRealtimeNewslettersUseCase',
        message: 'No pending newsletters to process'
      } as any);
      return;
    }

    this.logger.info({
      location: 'ProcessRealtimeNewslettersUseCase',
      count: pendingNewsletters.length,
      message: `Processing ${pendingNewsletters.length} newsletters (oldest first)`
    } as any);

    for (const newsletter of pendingNewsletters) {
      try {
        newsletter.markAsProcessing();
        await this.newsletterRepo.updateStatus(newsletter.id, newsletter.status);

        const activeSubscribers = await this.subscriberRepo.findActiveSubscribers();

        const deliveries = activeSubscribers.map((subscriber: Subscriber) =>
          NewsletterDelivery.createNew(newsletter.id, subscriber.id)
        );

        await this.deliveryRepo.bulkCreate(deliveries);

        const pendingDeliveries = await this.deliveryRepo.findPendingByNewsletterId(
          newsletter.id
        );

        if (pendingDeliveries.length === 0) {
          newsletter.markAsCompleted();
          await this.newsletterRepo.updateStatus(newsletter.id, newsletter.status);
          this.logger.info({
            location: 'ProcessRealtimeNewslettersUseCase',
            newsletterId: newsletter.id.getValue(),
            message: 'No recipients, marked as completed'
          } as any);
          continue;
        }

        const subscriberMap = new Map<string, Subscriber>();
        for (const subscriber of activeSubscribers) {
          subscriberMap.set(subscriber.id.getValue().toString(), subscriber);
        }

        const batches = this.chunkArray(pendingDeliveries, this.BATCH_SIZE);
        let batchSuccessCount = 0;
        let batchFailCount = 0;

        for (const batch of batches) {
          try {
            const emailsToSend: string[] = [];
            const deliveryIds: NewsletterDelivery[] = [];

            for (const delivery of batch) {
              const subscriber = subscriberMap.get(delivery.subscriberId.getValue().toString());
              if (subscriber) {
                emailsToSend.push(subscriber.email.getValue());
                deliveryIds.push(delivery);
              }
            }

            if (emailsToSend.length > 0) {
              await this.emailService.sendNewsletterBatch(emailsToSend, newsletter);

              for (const delivery of deliveryIds) {
                delivery.markAsSent();
                await this.deliveryRepo.updateStatus(
                  delivery.id,
                  delivery.status,
                  delivery.sentAt,
                  null
                );
              }

              batchSuccessCount += emailsToSend.length;
            }
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';

            for (const delivery of batch) {
              delivery.markAsFailed(errorMessage);
              await this.deliveryRepo.updateStatus(
                delivery.id,
                delivery.status,
                null,
                delivery.errorMessage
              );
            }

            batchFailCount += batch.length;
            this.logger.error({
              location: 'ProcessRealtimeNewslettersUseCase',
              newsletterId: newsletter.id.getValue(),
              code: 'BATCH_SEND_FAILED',
              message: error instanceof Error ? error.message : String(error)
            } as any);
          }
        }

        newsletter.markAsCompleted();
        await this.newsletterRepo.updateStatus(newsletter.id, newsletter.status);

        this.logger.info({
          location: 'ProcessRealtimeNewslettersUseCase',
          newsletterId: newsletter.id.getValue(),
          sent: batchSuccessCount,
          failed: batchFailCount,
          message: `Newsletter ${newsletter.id.getValue()} completed`
        } as any);

      } catch (error) {
        this.logger.error({
          location: 'ProcessRealtimeNewslettersUseCase',
          newsletterId: newsletter.id.getValue(),
          code: 'PROCESSING_FAILED',
          message: error instanceof Error ? error.message : String(error)
        } as any);
      }
    }
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}
