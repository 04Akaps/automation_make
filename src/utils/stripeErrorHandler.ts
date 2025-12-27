export enum StripeErrorType {
  CARD_ERROR = 'StripeCardError',
  INVALID_REQUEST = 'StripeInvalidRequestError',
  API_ERROR = 'StripeAPIError',
  CONNECTION_ERROR = 'StripeConnectionError',
  AUTHENTICATION_ERROR = 'StripeAuthenticationError',
  RATE_LIMIT_ERROR = 'StripeRateLimitError',
  PERMISSION_ERROR = 'StripePermissionError',
  IDEMPOTENCY_ERROR = 'StripeIdempotencyError',
}

export const ErrorStatusCodeMap: Record<StripeErrorType, number> = {
  [StripeErrorType.CARD_ERROR]: 402,
  [StripeErrorType.INVALID_REQUEST]: 400,
  [StripeErrorType.API_ERROR]: 500,
  [StripeErrorType.CONNECTION_ERROR]: 503,
  [StripeErrorType.AUTHENTICATION_ERROR]: 401,
  [StripeErrorType.RATE_LIMIT_ERROR]: 429,
  [StripeErrorType.PERMISSION_ERROR]: 403,
  [StripeErrorType.IDEMPOTENCY_ERROR]: 400,
};

export const ErrorMessageMap: Record<StripeErrorType, string> = {
  [StripeErrorType.CARD_ERROR]: 'Card payment failed',
  [StripeErrorType.INVALID_REQUEST]: 'Invalid request',
  [StripeErrorType.API_ERROR]: 'Payment service error',
  [StripeErrorType.CONNECTION_ERROR]: 'Payment service unavailable',
  [StripeErrorType.AUTHENTICATION_ERROR]: 'Authentication failed',
  [StripeErrorType.RATE_LIMIT_ERROR]: 'Too many requests',
  [StripeErrorType.PERMISSION_ERROR]: 'Permission denied',
  [StripeErrorType.IDEMPOTENCY_ERROR]: 'Duplicate request',
};

export interface StripeErrorInfo {
  statusCode: number;
  errorMessage: string;
  detailMessage: string;
  errorType: StripeErrorType | null;
}

export function isStripeError(error: any): boolean {
  return error?.type && Object.values(StripeErrorType).includes(error.type);
}

export function handleStripeError(error: any): StripeErrorInfo {
  if (isStripeError(error)) {
    const errorType = error.type as StripeErrorType;
    
    return {
      statusCode: ErrorStatusCodeMap[errorType] || 500,
      errorMessage: ErrorMessageMap[errorType] || 'Payment error',
      detailMessage: error.message || 'Unknown error',
      errorType,
    };
  }

  return {
    statusCode: 500,
    errorMessage: 'Internal server error',
    detailMessage: error instanceof Error ? error.message : 'Unknown error',
    errorType: null,
  };
}

export function isErrorType(error: any, type: StripeErrorType): boolean {
  return error?.type === type;
}

export function isCardError(error: any): boolean {
  return isErrorType(error, StripeErrorType.CARD_ERROR);
}

export function isInvalidRequestError(error: any): boolean {
  return isErrorType(error, StripeErrorType.INVALID_REQUEST);
}

export function isAPIError(error: any): boolean {
  return isErrorType(error, StripeErrorType.API_ERROR);
}

