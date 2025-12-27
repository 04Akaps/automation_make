import 'reflect-metadata';
import dotenv from 'dotenv';
import cron from 'node-cron';
import winston from 'winston';
import { container } from '../di/container';
import { DI_TOKENS } from '../di/tokens';
import { ProcessRealtimeNewslettersUseCase } from '../application/realtime-newsletter/use-cases/ProcessRealtimeNewsletters/ProcessRealtimeNewsletters.usecase';

dotenv.config();

export async function runBatch() {
  const logger = container.resolve<winston.Logger>(DI_TOKENS.LOGGER);

  try {
    logger.info({
      location: 'NewsletterBatch',
      message: 'Batch started'
    } as any);

    const useCase = container.resolve<ProcessRealtimeNewslettersUseCase>(
      DI_TOKENS.PROCESS_REALTIME_NEWSLETTERS_USE_CASE
    );

    await useCase.execute();

    logger.info({
      location: 'NewsletterBatch',
      message: 'Batch completed'
    } as any);
  } catch (error) {
    logger.error({
      location: 'NewsletterBatch',
      code: 'BATCH_FAILED',
      message: error instanceof Error ? error.message : String(error)
    } as any);
    throw error;
  }
}

export function startNewsletterBatchWorker() {
  const logger = container.resolve<winston.Logger>(DI_TOKENS.LOGGER);

  logger.info({
    location: 'NewsletterBatch',
    schedule: '*/10 * * * *',
    message: 'Newsletter batch worker started (every 10 minutes)'
  } as any);

  cron.schedule('*/10 * * * *', async () => {
    await runBatch();
  });

  runBatch();
}

if (require.main === module) {
  const isDaemon = process.argv.includes('--daemon');
  const logger = container.resolve<winston.Logger>(DI_TOKENS.LOGGER);

  if (isDaemon) {
    startNewsletterBatchWorker();

    process.on('SIGINT', () => {
      logger.info({
        location: 'NewsletterBatch',
        signal: 'SIGINT',
        message: 'Shutting down newsletter batch worker'
      } as any);
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      logger.info({
        location: 'NewsletterBatch',
        signal: 'SIGTERM',
        message: 'Shutting down newsletter batch worker'
      } as any);
      process.exit(0);
    });
  } else {
    logger.info({
      location: 'NewsletterBatch',
      message: 'Running newsletter batch (one-time)'
    } as any);

    runBatch()
      .then(() => {
        logger.info({
          location: 'NewsletterBatch',
          message: 'Newsletter batch completed, exiting'
        } as any);
        process.exit(0);
      })
      .catch((error) => {
        logger.error({
          location: 'NewsletterBatch',
          code: 'EXIT_ERROR',
          message: error instanceof Error ? error.message : String(error)
        } as any);
        process.exit(1);
      });
  }
}
