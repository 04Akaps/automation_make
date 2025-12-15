import { injectable, inject } from 'tsyringe';
import { IPaymentService } from '../../ports/IPaymentService.interface';
import { CreateCheckoutSessionInputDto, CreateCheckoutSessionOutputDto } from './CreateCheckoutSession.dto';

@injectable()
export class CreateCheckoutSessionUseCase {
  constructor(
    @inject('IPaymentService') private paymentService: IPaymentService
  ) {}

  async execute(input: CreateCheckoutSessionInputDto): Promise<CreateCheckoutSessionOutputDto> {
    const result = await this.paymentService.createCheckoutSession({
      email: input.email,
      priceId: input.priceId,
    });

    return {
      clientSecret: result.clientSecret,
    };
  }
}
