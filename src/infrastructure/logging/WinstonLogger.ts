import winston from 'winston';
import { singleton } from 'tsyringe';

@singleton()
export class WinstonLogger {
  private logger: winston.Logger;

  constructor() {
    const customFormat = winston.format.printf((info) => {
      const { level, message, timestamp, location, code, ...rest } = info;
      const parts: string[] = [];

      parts.push(String(timestamp));

      if (location) {
        parts.push(`[${location}]`);
      }

      const additionalFields = Object.keys(rest)
        .filter(key => !['level', 'message', 'timestamp', 'location', 'code', 'splat', Symbol.for('level'), Symbol.for('splat')].includes(key))
        .map(key => `${key}=${JSON.stringify(rest[key])}`)
        .join(' ');

      if (additionalFields) {
        parts.push(additionalFields);
      }

      if (message) {
        parts.push(String(message));
      }

      if (code) {
        parts.push(`[${code}]`);
      }

      return parts.join(' ');
    });

    this.logger = winston.createLogger({
      level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true })
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize({ all: true }),
            winston.format.printf((info) => {
              const { level, message, timestamp, location, code, ...rest } = info;
              const parts: string[] = [];

              parts.push(level);
              parts.push(String(timestamp));

              if (location) {
                parts.push(`[${location}]`);
              }

              const additionalFields = Object.keys(rest)
                .filter(key => !['level', 'message', 'timestamp', 'location', 'code', 'splat', Symbol.for('level'), Symbol.for('splat')].includes(key))
                .map(key => `${key}=${JSON.stringify(rest[key])}`)
                .join(' ');

              if (additionalFields) {
                parts.push(additionalFields);
              }

              if (message) {
                parts.push(String(message));
              }

              if (code) {
                parts.push(`[${code}]`);
              }

              return parts.join(' ');
            })
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
