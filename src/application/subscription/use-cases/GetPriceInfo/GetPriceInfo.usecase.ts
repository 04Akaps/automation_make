import { injectable, inject } from 'tsyringe';
import { IPaymentService } from '../../ports/IPaymentService.interface';
import { GetPriceInfoInputDto, GetPriceInfoOutputDto } from './GetPriceInfo.dto';

@injectable()
export class GetPriceInfoUseCase {
  constructor(
    @inject('IPaymentService') private paymentService: IPaymentService
  ) {}

  async execute(input: GetPriceInfoInputDto): Promise<GetPriceInfoOutputDto> {
    const priceId = input.priceId || process.env.STRIPE_PRICE_ID;

    if (!priceId) {
      throw new Error('Price ID not configured');
    }

    const priceInfo = await this.paymentService.getPriceInfo(priceId);

    return priceInfo;
  }
}
