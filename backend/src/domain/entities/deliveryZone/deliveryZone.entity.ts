import { DeliveryZoneInterface } from './deliveryZone.entity.interface';

export class DeliveryZone implements DeliveryZoneInterface {
  constructor(
    public id: string,
    public name: string,
    public postalCode: string | null = null,
    public city: string | null = null,
    public distanceKm: number = 0,
    public isActive: boolean = true,
    public createdAt: Date,
  ) {}
}
