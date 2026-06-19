export interface CalculateDeliveryPriceParamsInterface {
  deliveryZoneId?: string;
  postalCode?: string;
}

export interface CalculateDeliveryPriceResultInterface {
  zoneId: string;
  zoneName: string;
  city: string | null;
  distanceKm: number;
  deliveryFee: number;
}

export interface CalculateDeliveryPriceUseCaseInterface {
  executeCalculateDeliveryPrice: (
    params: CalculateDeliveryPriceParamsInterface,
  ) => Promise<CalculateDeliveryPriceResultInterface>;
}
