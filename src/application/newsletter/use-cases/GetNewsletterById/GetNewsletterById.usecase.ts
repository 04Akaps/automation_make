import { injectable, inject } from 'tsyringe';
import { INewsletterRepository } from '../../../../domain/newsletter/repositories/INewsletterRepository.interface';
import { UniqueId } from '../../../../domain/shared/value-objects/UniqueId.vo';
import { NotFoundError } from '../../../../domain/shared/errors/NotFoundError';
import { GetNewsletterByIdInputDto, GetNewsletterByIdOutputDto } from './GetNewsletterById.dto';
import { NewsletterMapper } from '../../mappers/NewsletterMapper';

@injectable()
export class GetNewsletterByIdUseCase {
  constructor(
    @inject('INewsletterRepository') private repository: INewsletterRepository
  ) {}

  async execute(input: GetNewsletterByIdInputDto): Promise<GetNewsletterByIdOutputDto> {
    const newsletter = await this.repository.findById(UniqueId.create(input.id));

    if (!newsletter) {
      throw new NotFoundError(`Newsletter with id ${input.id} not found`);
    }

    return NewsletterMapper.toDto(newsletter);
  }
}
