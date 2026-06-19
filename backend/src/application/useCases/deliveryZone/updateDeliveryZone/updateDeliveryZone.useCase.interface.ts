import { DeliveryZoneInterface } from '@/domain/entities/deliveryZone/deliveryZone.entity.interface';

export interface UpdateDeliveryZoneDataInterface {
  name?: string;
  postalCode?: string | null;
  city?: string | null;
  distanceKm?: number;
  isActive?: boolean;
}

export interface ExecuteUpdateDeliveryZoneOptions {
  id: string;
  data: UpdateDeliveryZoneDataInterface;
}

export interface UpdateDeliveryZoneUseCaseInterface {
  executeUpdateDeliveryZone: (options: ExecuteUpdateDeliveryZoneOptions) => Promise<DeliveryZoneInterface>;
}
