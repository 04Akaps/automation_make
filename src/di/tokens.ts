export const DI_TOKENS = {
  NEWSLETTER_REPOSITORY: 'INewsletterRepository',
  SUBSCRIBER_REPOSITORY: 'ISubscriberRepository',
  FEATURE_FLAG_REPOSITORY: 'IFeatureFlagRepository',
  REALTIME_NEWSLETTER_REPOSITORY: 'IRealtimeNewsletterRepository',
  NEWSLETTER_DELIVERY_REPOSITORY: 'INewsletterDeliveryRepository',
  PAYMENT_SERVICE: 'IPaymentService',
  EMAIL_SERVICE: 'IEmailService',
  EVENT_DISPATCHER: 'IEventDispatcher',
  LOGGER: 'Logger',

  GET_NEWSLETTERS_USE_CASE: 'GetNewslettersUseCase',
  GET_NEWSLETTER_BY_ID_USE_CASE: 'GetNewsletterByIdUseCase',

  CREATE_SUBSCRIPTION_USE_CASE: 'CreateSubscriptionUseCase',
  GET_SUBSCRIPTION_STATUS_USE_CASE: 'GetSubscriptionStatusUseCase',
  CANCEL_SUBSCRIPTION_USE_CASE: 'CancelSubscriptionUseCase',
  CREATE_CHECKOUT_SESSION_USE_CASE: 'CreateCheckoutSessionUseCase',
  GET_PRICE_INFO_USE_CASE: 'GetPriceInfoUseCase',

  PROCESS_REALTIME_NEWSLETTERS_USE_CASE: 'ProcessRealtimeNewslettersUseCase',
};
