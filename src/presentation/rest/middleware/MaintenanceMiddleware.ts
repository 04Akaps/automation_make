import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { DI_TOKENS } from '../../../di/tokens';
import { IFeatureFlagRepository } from '../../../domain/feature-flag/repositories/IFeatureFlagRepository.interface';
import { ServiceName } from '../../../domain/feature-flag/value-objects/ServiceName.vo';

const SERVICE_NAME = 'crypto_letters';

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
    // If feature flag check fails, allow the request to proceed
    // This prevents the feature flag system from blocking all requests in case of errors
    console.error('Feature flag check failed:', error);
    next();
  }
};
