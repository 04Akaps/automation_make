import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'tsyringe';
import { GetNewslettersUseCase } from '../../../application/newsletter/use-cases/GetNewsletters/GetNewsletters.usecase';
import { GetNewsletterByIdUseCase } from '../../../application/newsletter/use-cases/GetNewsletterById/GetNewsletterById.usecase';
import { GetNewslettersQuerySchema } from '../../../application/newsletter/use-cases/GetNewsletters/GetNewsletters.schema';
import { GetNewsletterByIdParamsSchema } from '../../../application/newsletter/use-cases/GetNewsletterById/GetNewsletterById.schema';
import { ApiResponse } from '../../../application/shared/dtos/ApiResponse.dto';
import { DI_TOKENS } from '../../../di/tokens';

@injectable()
export class NewsletterController {
  constructor(
    @inject(DI_TOKENS.GET_NEWSLETTERS_USE_CASE) private getNewslettersUseCase: GetNewslettersUseCase,
    @inject(DI_TOKENS.GET_NEWSLETTER_BY_ID_USE_CASE) private getNewsletterByIdUseCase: GetNewsletterByIdUseCase
  ) {}

  getNewsletters = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validated = GetNewslettersQuerySchema.parse(req.query);

      const result = await this.getNewslettersUseCase.execute({
        cursor: validated.cursor,
        limit: validated.limit,
      });

      res.json(ApiResponse.success(result, 'Newsletters fetched successfully').toJSON());
    } catch (error) {
      next(error);
    }
  };

  getNewsletterById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validated = GetNewsletterByIdParamsSchema.parse(req.params);

      const result = await this.getNewsletterByIdUseCase.execute({
        id: validated.id,
      });

      res.json(ApiResponse.success(result, 'Newsletter fetched successfully').toJSON());
    } catch (error) {
      next(error);
    }
  };
}
