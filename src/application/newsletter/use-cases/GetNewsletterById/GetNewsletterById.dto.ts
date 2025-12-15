import { NewsletterDto } from '../GetNewsletters/GetNewsletters.dto';

export interface GetNewsletterByIdInputDto {
  id: string | number;
}

export type GetNewsletterByIdOutputDto = NewsletterDto;
