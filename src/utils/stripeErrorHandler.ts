/**
 * Stripe 에러 타입 정의
 */
export enum StripeErrorType {
  // 카드 에러
  CARD_ERROR = 'StripeCardError',
  
  // 잘못된 요청
  INVALID_REQUEST = 'StripeInvalidRequestError',
  
  // API 에러
  API_ERROR = 'StripeAPIError',
  
  // 연결 에러
  CONNECTION_ERROR = 'StripeConnectionError',
  
  // 인증 에러
  AUTHENTICATION_ERROR = 'StripeAuthenticationError',
  
  // Rate Limit 에러
  RATE_LIMIT_ERROR = 'StripeRateLimitError',
  
  // 권한 에러
  PERMISSION_ERROR = 'StripePermissionError',
  
  // Idempotency 에러
  IDEMPOTENCY_ERROR = 'StripeIdempotencyError',
}

/**
 * 에러 타입별 HTTP 상태 코드 매핑
 */
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

/**
 * 에러 타입별 사용자 친화적 메시지
 */
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

/**
 * Stripe 에러 정보
 */
export interface StripeErrorInfo {
  statusCode: number;
  errorMessage: string;
  detailMessage: string;
  errorType: StripeErrorType | null;
}

/**
 * Stripe 에러 타입 확인
 */
export function isStripeError(error: any): boolean {
  return error?.type && Object.values(StripeErrorType).includes(error.type);
}

/**
 * Stripe 에러 처리 헬퍼
 */
export function handleStripeError(error: any): StripeErrorInfo {
  // Stripe 에러인 경우
  if (isStripeError(error)) {
    const errorType = error.type as StripeErrorType;
    
    return {
      statusCode: ErrorStatusCodeMap[errorType] || 500,
      errorMessage: ErrorMessageMap[errorType] || 'Payment error',
      detailMessage: error.message || 'Unknown error',
      errorType,
    };
  }
  
  // 일반 에러인 경우
  return {
    statusCode: 500,
    errorMessage: 'Internal server error',
    detailMessage: error instanceof Error ? error.message : 'Unknown error',
    errorType: null,
  };
}

/**
 * 특정 에러 타입인지 확인
 */
export function isErrorType(error: any, type: StripeErrorType): boolean {
  return error?.type === type;
}

/**
 * 카드 에러인지 확인
 */
export function isCardError(error: any): boolean {
  return isErrorType(error, StripeErrorType.CARD_ERROR);
}

/**
 * 잘못된 요청 에러인지 확인
 */
export function isInvalidRequestError(error: any): boolean {
  return isErrorType(error, StripeErrorType.INVALID_REQUEST);
}

/**
 * API 에러인지 확인
 */
export function isAPIError(error: any): boolean {
  return isErrorType(error, StripeErrorType.API_ERROR);
}

