import { Request, Response, NextFunction } from 'express';
import winston from 'winston';
import { container } from '../../../di/container';
import { DI_TOKENS } from '../../../di/tokens';

export class LoggingMiddleware {
  static log(req: Request, res: Response, next: NextFunction): void {
    const logger = container.resolve<winston.Logger>(DI_TOKENS.LOGGER);
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;
      logger.info({
        location: 'HTTP',
        method: req.method,
        path: req.path,
        status: res.statusCode,
        duration: `${duration}ms`,
        message: `${req.method} ${req.path} ${res.statusCode}`
      } as any);
    });

    next();
  }
}
