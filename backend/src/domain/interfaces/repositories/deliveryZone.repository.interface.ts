import { DeliveryZoneInterface } from '@/domain/entities/deliveryZone/deliveryZone.entity.interface';

export type SortOrder = 'ASC' | 'DESC';
export type DeliveryZoneSortBy = 'name' | 'city' | 'distanceKm' | 'createdAt';

export interface FindAllDeliveryZonesParamsInterface {
  search?: string;
  isActive?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: DeliveryZoneSortBy;
  sortOrder?: SortOrder;
}

export interface DeliveryZoneRepositoryInterface {
  findById: (id: string) => Promise<DeliveryZoneInterface | null>;
  findByPostalCode: (postalCode: string) => Promise<DeliveryZoneInterface | null>;
  findAll: (params?: FindAllDeliveryZonesParamsInterface) => Promise<DeliveryZoneInterface[]>;
  countFindAll: (params?: FindAllDeliveryZonesParamsInterface) => Promise<number>;
  create: (deliveryZone: DeliveryZoneInterface) => Promise<DeliveryZoneInterface>;
  updateOne: (id: string, data: Partial<DeliveryZoneInterface>) => Promise<void>;
  deleteOne: (id: string) => Promise<void>;
}
