import { DeliveryZoneInterface } from '@/domain/entities/deliveryZone/deliveryZone.entity.interface';

export interface CreateDeliveryZoneDataInterface {
  name: string;
  postalCode?: string | null;
  city?: string | null;
  distanceKm?: number;
  isActive?: boolean;
}

export interface CreateDeliveryZoneUseCaseInterface {
  executeCreateDeliveryZone: (data: CreateDeliveryZoneDataInterface) => Promise<DeliveryZoneInterface>;
}
