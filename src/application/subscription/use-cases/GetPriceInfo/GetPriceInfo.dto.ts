export interface GetPriceInfoInputDto {
  priceId?: string;
}

export interface GetPriceInfoOutputDto {
  id: string;
  amount: number;
  currency: string;
  interval: string;
  intervalCount: number;
  productName: string;
  productDescription: string | null;
}
