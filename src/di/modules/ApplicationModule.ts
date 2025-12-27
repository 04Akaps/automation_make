import { DependencyContainer } from 'tsyringe';
import { DI_TOKENS } from '../tokens';
import { GetNewslettersUseCase } from '../../application/newsletter/use-cases/GetNewsletters/GetNewsletters.usecase';
import { GetNewsletterByIdUseCase } from '../../application/newsletter/use-cases/GetNewsletterById/GetNewsletterById.usecase';
import { CreateSubscriptionUseCase } from '../../application/subscription/use-cases/CreateSubscription/CreateSubscription.usecase';
import { GetSubscriptionStatusUseCase } from '../../application/subscription/use-cases/GetSubscriptionStatus/GetSubscriptionStatus.usecase';
import { CancelSubscriptionUseCase } from '../../application/subscription/use-cases/CancelSubscription/CancelSubscription.usecase';
import { CreateCheckoutSessionUseCase } from '../../application/subscription/use-cases/CreateCheckoutSession/CreateCheckoutSession.usecase';
import { GetPriceInfoUseCase } from '../../application/subscription/use-cases/GetPriceInfo/GetPriceInfo.usecase';
import { ProcessRealtimeNewslettersUseCase } from '../../application/realtime-newsletter/use-cases/ProcessRealtimeNewsletters/ProcessRealtimeNewsletters.usecase';

export function registerApplication(container: DependencyContainer): void {
  container.register(DI_TOKENS.GET_NEWSLETTERS_USE_CASE, {
    useClass: GetNewslettersUseCase,
  });

  container.register(DI_TOKENS.GET_NEWSLETTER_BY_ID_USE_CASE, {
    useClass: GetNewsletterByIdUseCase,
  });

  container.register(DI_TOKENS.CREATE_SUBSCRIPTION_USE_CASE, {
    useClass: CreateSubscriptionUseCase,
  });

  container.register(DI_TOKENS.GET_SUBSCRIPTION_STATUS_USE_CASE, {
    useClass: GetSubscriptionStatusUseCase,
  });

  container.register(DI_TOKENS.CANCEL_SUBSCRIPTION_USE_CASE, {
    useClass: CancelSubscriptionUseCase,
  });

  container.register(DI_TOKENS.CREATE_CHECKOUT_SESSION_USE_CASE, {
    useClass: CreateCheckoutSessionUseCase,
  });

  container.register(DI_TOKENS.GET_PRICE_INFO_USE_CASE, {
    useClass: GetPriceInfoUseCase,
  });

  container.register(DI_TOKENS.PROCESS_REALTIME_NEWSLETTERS_USE_CASE, {
    useClass: ProcessRealtimeNewslettersUseCase,
  });
}
