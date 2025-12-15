import { Request, Response, NextFunction } from 'express';

export class LoggingMiddleware {
  static log(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
    });

    next();
  }
}
