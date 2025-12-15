import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'tsyringe';
import { CreateSubscriptionUseCase } from '../../../application/subscription/use-cases/CreateSubscription/CreateSubscription.usecase';
import { GetSubscriptionStatusUseCase } from '../../../application/subscription/use-cases/GetSubscriptionStatus/GetSubscriptionStatus.usecase';
import { CancelSubscriptionUseCase } from '../../../application/subscription/use-cases/CancelSubscription/CancelSubscription.usecase';
import { CreateCheckoutSessionUseCase } from '../../../application/subscription/use-cases/CreateCheckoutSession/CreateCheckoutSession.usecase';
import { GetPriceInfoUseCase } from '../../../application/subscription/use-cases/GetPriceInfo/GetPriceInfo.usecase';
import { CreateSubscriptionBodySchema } from '../../../application/subscription/use-cases/CreateSubscription/CreateSubscription.schema';
import { GetSubscriptionStatusParamsSchema } from '../../../application/subscription/use-cases/GetSubscriptionStatus/GetSubscriptionStatus.schema';
import { CancelSubscriptionByEmailBodySchema } from '../../../application/subscription/use-cases/CancelSubscription/CancelSubscription.schema';
import { CreateCheckoutSessionBodySchema } from '../../../application/subscription/use-cases/CreateCheckoutSession/CreateCheckoutSession.schema';
import { ApiResponse } from '../../../application/shared/dtos/ApiResponse.dto';
import { DI_TOKENS } from '../../../di/tokens';

@injectable()
export class SubscriptionController {
  constructor(
    @inject(DI_TOKENS.CREATE_SUBSCRIPTION_USE_CASE) private createSubscriptionUseCase: CreateSubscriptionUseCase,
    @inject(DI_TOKENS.GET_SUBSCRIPTION_STATUS_USE_CASE) private getSubscriptionStatusUseCase: GetSubscriptionStatusUseCase,
    @inject(DI_TOKENS.CANCEL_SUBSCRIPTION_USE_CASE) private cancelSubscriptionUseCase: CancelSubscriptionUseCase,
    @inject(DI_TOKENS.CREATE_CHECKOUT_SESSION_USE_CASE) private createCheckoutSessionUseCase: CreateCheckoutSessionUseCase,
    @inject(DI_TOKENS.GET_PRICE_INFO_USE_CASE) private getPriceInfoUseCase: GetPriceInfoUseCase
  ) {}

  createSubscription = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validated = CreateSubscriptionBodySchema.parse(req.body);

      const result = await this.createSubscriptionUseCase.execute(validated);

      res.status(201).json(ApiResponse.success(result, 'Subscription created successfully').toJSON());
    } catch (error) {
      next(error);
    }
  };

  getSubscriptionStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validated = GetSubscriptionStatusParamsSchema.parse(req.params);

      const result = await this.getSubscriptionStatusUseCase.execute({
        email: decodeURIComponent(validated.email),
      });

      if (!result) {
        res.json(ApiResponse.success(null, 'No active subscription found').toJSON());
        return;
      }

      res.json(ApiResponse.success(result, 'Subscription status retrieved successfully').toJSON());
    } catch (error) {
      next(error);
    }
  };

  cancelSubscriptionByEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validated = CancelSubscriptionByEmailBodySchema.parse(req.body);

      const result = await this.cancelSubscriptionUseCase.execute({
        email: validated.email,
      });

      res.json(ApiResponse.success(result, 'Subscription cancelled successfully').toJSON());
    } catch (error) {
      next(error);
    }
  };

  createCheckoutSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validated = CreateCheckoutSessionBodySchema.parse(req.body);

      const result = await this.createCheckoutSessionUseCase.execute(validated);

      res.status(201).json(ApiResponse.success(result, 'Checkout session created successfully').toJSON());
    } catch (error) {
      next(error);
    }
  };

  getPrices = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.getPriceInfoUseCase.execute({
        priceId: process.env.STRIPE_PRICE_ID,
      });

      res.json(ApiResponse.success(result, 'Price information retrieved successfully').toJSON());
    } catch (error) {
      next(error);
    }
  };
}
