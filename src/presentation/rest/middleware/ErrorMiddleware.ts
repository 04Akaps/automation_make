import { Request, Response, NextFunction } from 'express';
import { DomainError } from '../../../domain/shared/errors/DomainError';
import { ValidationError } from '../../../domain/shared/errors/ValidationError';
import { NotFoundError } from '../../../domain/shared/errors/NotFoundError';
import { ApiResponse } from '../../../application/shared/dtos/ApiResponse.dto';
import { handleStripeError } from '../../../utils/stripeErrorHandler';
import { ZodError } from 'zod';

export class ErrorMiddleware {
  static handle(err: any, req: Request, res: Response, next: NextFunction): void {
    console.error('Error:', err);

    if (err.name === 'ZodError' && err.issues) {
      const errorMessage = err.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ');
      res.status(400).json(ApiResponse.error('Validation error', errorMessage).toJSON());
      return;
    }

    if (err instanceof NotFoundError) {
      res.status(404).json(ApiResponse.error(err.message).toJSON());
      return;
    }

    if (err instanceof ValidationError) {
      res.status(400).json(ApiResponse.error(err.message).toJSON());
      return;
    }

    if (err instanceof DomainError) {
      res.status(422).json(ApiResponse.error(err.message).toJSON());
      return;
    }

    const stripeError = handleStripeError(err);
    if (stripeError.errorType) {
      res.status(stripeError.statusCode).json(
        ApiResponse.error(stripeError.errorMessage, stripeError.detailMessage).toJSON()
      );
      return;
    }

    res.status(500).json(
      ApiResponse.error('Internal server error', err.message || 'Unknown error').toJSON()
    );
  }
}
