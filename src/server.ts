import 'reflect-metadata';
import dotenv from 'dotenv';
import winston from 'winston';
import './di/container';
import { createApp } from './presentation';
import { container } from './di/container';
import { DI_TOKENS } from './di/tokens';
import { startNewsletterBatchWorker } from './batch/newsletter-batch';

dotenv.config();

const app = createApp();
const port = process.env.PORT || 3001;
const logger = container.resolve<winston.Logger>(DI_TOKENS.LOGGER);

app.listen(port, () => {
  logger.info({
    location: 'Server',
    port,
    env: process.env.NODE_ENV || 'development',
    message: `API Server started on port ${port}`
  } as any);
});

startNewsletterBatchWorker();

process.on('SIGINT', () => {
  logger.info({
    location: 'Server',
    signal: 'SIGINT',
    message: 'Shutting down server gracefully'
  } as any);
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info({
    location: 'Server',
    signal: 'SIGTERM',
    message: 'Shutting down server gracefully'
  } as any);
  process.exit(0);
});

export default app;
