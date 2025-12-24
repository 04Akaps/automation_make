import 'reflect-metadata';
import express, { Application } from 'express';
import cors from 'cors';
import { ErrorMiddleware } from './rest/middleware/ErrorMiddleware';
import { LoggingMiddleware } from './rest/middleware/LoggingMiddleware';
import { maintenanceMiddleware } from './rest/middleware/MaintenanceMiddleware';
import newsletterRoutes from './rest/routes/newsletter.routes';
import subscriptionRoutes from './rest/routes/subscription.routes';
import webhookRoutes from './rest/routes/webhook.routes';
import healthRoutes from './rest/routes/health.routes';

export function createApp(): Application {
  const app = express();

  app.use(cors());
  app.use(LoggingMiddleware.log);

  app.use('/api/webhooks', express.raw({ type: 'application/json' }), webhookRoutes);

  app.use(express.json());

  app.use('/health', healthRoutes);
  app.use('/api/newsletters', maintenanceMiddleware, newsletterRoutes);
  app.use('/api/subscriptions', maintenanceMiddleware, subscriptionRoutes);
  app.use('/api/payment', maintenanceMiddleware, subscriptionRoutes);

  app.use(ErrorMiddleware.handle);

  return app;
}
