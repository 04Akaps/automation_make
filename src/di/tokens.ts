export const DI_TOKENS = {
  NEWSLETTER_REPOSITORY: 'INewsletterRepository',
  SUBSCRIBER_REPOSITORY: 'ISubscriberRepository',
  PAYMENT_SERVICE: 'IPaymentService',
  EVENT_DISPATCHER: 'IEventDispatcher',
  LOGGER: 'Logger',

  GET_NEWSLETTERS_USE_CASE: 'GetNewslettersUseCase',
  GET_NEWSLETTER_BY_ID_USE_CASE: 'GetNewsletterByIdUseCase',

  CREATE_SUBSCRIPTION_USE_CASE: 'CreateSubscriptionUseCase',
  GET_SUBSCRIPTION_STATUS_USE_CASE: 'GetSubscriptionStatusUseCase',
  CANCEL_SUBSCRIPTION_USE_CASE: 'CancelSubscriptionUseCase',
  CREATE_CHECKOUT_SESSION_USE_CASE: 'CreateCheckoutSessionUseCase',
  GET_PRICE_INFO_USE_CASE: 'GetPriceInfoUseCase',
};
