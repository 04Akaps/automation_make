export interface CreateCheckoutSessionInputDto {
  email: string;
  priceId?: string;
}

export interface CreateCheckoutSessionOutputDto {
  clientSecret: string;
}
