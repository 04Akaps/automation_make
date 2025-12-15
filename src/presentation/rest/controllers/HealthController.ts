import { Request, Response } from 'express';
import { ApiResponse } from '../../../application/shared/dtos/ApiResponse.dto';

export class HealthController {
  static check(req: Request, res: Response): void {
    res.json(
      ApiResponse.success(
        {
          status: 'healthy',
          timestamp: new Date().toISOString(),
        },
        'Service is running'
      ).toJSON()
    );
  }
}
