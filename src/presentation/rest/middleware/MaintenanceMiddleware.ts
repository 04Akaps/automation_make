import { Request, Response, NextFunction } from 'express';
import winston from 'winston';
import { container } from 'tsyringe';
import { DI_TOKENS } from '../../../di/tokens';
import { IFeatureFlagRepository } from '../../../domain/feature-flag/repositories/IFeatureFlagRepository.interface';
import { ServiceName } from '../../../domain/feature-flag/value-objects/ServiceName.vo';

const SERVICE_NAME = 'crypto_letters';
const logger = container.resolve<winston.Logger>(DI_TOKENS.LOGGER);

export const maintenanceMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const featureFlagRepository = container.resolve<IFeatureFlagRepository>(
      DI_TOKENS.FEATURE_FLAG_REPOSITORY
    );

    const serviceName = ServiceName.create(SERVICE_NAME);
    const featureFlag = await featureFlagRepository.findByServiceName(serviceName);

    if (featureFlag && featureFlag.isUnderMaintenance()) {
      res.status(503).json({
        success: false,
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: 'Service is currently under maintenance. Please try again later.',
        },
      });
      return;
    }

    next();
  } catch (error) {
    logger.error({
      location: 'MaintenanceMiddleware',
      code: 'FEATURE_FLAG_CHECK_FAILED',
      message: error instanceof Error ? error.message : String(error)
    } as any);
    next();
  }
};
