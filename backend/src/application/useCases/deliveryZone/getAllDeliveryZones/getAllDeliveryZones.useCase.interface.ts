import { DeliveryZoneInterface } from '@/domain/entities/deliveryZone/deliveryZone.entity.interface';
import { FindAllDeliveryZonesParamsInterface } from '@/domain/interfaces/repositories/deliveryZone.repository.interface';

export interface GetAllDeliveryZonesResultInterface {
  items: DeliveryZoneInterface[];
  totalCount: number;
}

export interface GetAllDeliveryZonesUseCaseInterface {
  executeGetAllDeliveryZones: (
    params?: FindAllDeliveryZonesParamsInterface,
  ) => Promise<GetAllDeliveryZonesResultInterface>;
}
