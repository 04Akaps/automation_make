import { DependencyContainer } from 'tsyringe';
import { DI_TOKENS } from '../tokens';
import { DatabaseConnection } from '../../infrastructure/persistence/mysql/connection/DatabaseConnection';
import { MySqlNewsletterRepository } from '../../infrastructure/persistence/mysql/repositories/MySqlNewsletterRepository';
import { MySqlSubscriberRepository } from '../../infrastructure/persistence/mysql/repositories/MySqlSubscriberRepository';
import { StripePaymentService } from '../../infrastructure/payment/stripe/StripePaymentService';
import { InMemoryEventDispatcher } from '../../infrastructure/events/InMemoryEventDispatcher';
import { WinstonLogger } from '../../infrastructure/logging/WinstonLogger';

export function registerInfrastructure(container: DependencyContainer): void {
  container.registerSingleton(DatabaseConnection);

  container.register(DI_TOKENS.NEWSLETTER_REPOSITORY, {
    useClass: MySqlNewsletterRepository,
  });

  container.register(DI_TOKENS.SUBSCRIBER_REPOSITORY, {
    useClass: MySqlSubscriberRepository,
  });

  container.register(DI_TOKENS.PAYMENT_SERVICE, {
    useClass: StripePaymentService,
  });

  container.registerSingleton(DI_TOKENS.EVENT_DISPATCHER, InMemoryEventDispatcher);

  const winstonLogger = container.resolve(WinstonLogger);
  container.register(DI_TOKENS.LOGGER, {
    useValue: winstonLogger.getLogger(),
  });
}
