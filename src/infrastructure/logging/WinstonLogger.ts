import winston from 'winston';
import { singleton } from 'tsyringe';

@singleton()
export class WinstonLogger {
  private logger: winston.Logger;

  constructor() {
    const customFormat = winston.format.printf(({ level, message, timestamp, location, code }) => {
      const levelUpper = level.toUpperCase();
      const parts: string[] = [];

      parts.push(`[${levelUpper}]`);

      if (location) {
        parts.push(`location: ${location}`);
      }

      if (code) {
        parts.push(`code: "${code}"`);
      }

      parts.push(`message: ${message}`);

      return `${timestamp} ${parts.join(' | ')}`;
    });

    this.logger = winston.createLogger({
      level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        customFormat
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            customFormat
          ),
        }),
      ],
    });

    if (process.env.NODE_ENV === 'production') {
      this.logger.add(new winston.transports.File({ filename: 'logs/error.log', level: 'error' }));
      this.logger.add(new winston.transports.File({ filename: 'logs/combined.log' }));
    }
  }

  getLogger(): winston.Logger {
    return this.logger;
  }

  info(location: string, message: string | object): void {
    if (typeof message === 'string') {
      this.logger.info({ location, message });
    } else {
      this.logger.info({ location, ...message });
    }
  }

  error(location: string, error: any, code?: string): void {
    this.logger.error({
      location,
      code,
      message: error instanceof Error ? error.message : String(error),
    });
  }

  warn(location: string, message: string): void {
    this.logger.warn({ location, message });
  }

  debug(location: string, message: string): void {
    if (process.env.NODE_ENV === 'development') {
      this.logger.debug({ location, message });
    }
  }
}
