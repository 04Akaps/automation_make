import { injectable, inject } from 'tsyringe';
import { INewsletterRepository } from '../../../../domain/newsletter/repositories/INewsletterRepository.interface';
import { GetNewslettersInputDto, GetNewslettersOutputDto } from './GetNewsletters.dto';
import { NewsletterMapper } from '../../mappers/NewsletterMapper';
import { ServiceName } from '../../../../domain/feature-flag/value-objects/ServiceName.vo';

@injectable()
export class GetNewslettersUseCase {
  constructor(
    @inject('INewsletterRepository') private repository: INewsletterRepository
  ) {}

  async execute(input: GetNewslettersInputDto): Promise<GetNewslettersOutputDto> {
    const serviceName = input.serviceName ? ServiceName.create(input.serviceName) : undefined;
    const result = await this.repository.findAll(input.cursor, input.limit || 10, serviceName);

    return {
      data: result.data.map(newsletter => NewsletterMapper.toDto(newsletter)),
      nextCursor: result.nextCursor,
      hasMore: result.hasMore,
    };
  }
}
