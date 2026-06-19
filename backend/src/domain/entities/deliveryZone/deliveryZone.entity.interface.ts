export interface DeliveryZoneInterface {
  id: string;
  name: string;
  postalCode: string | null;
  city: string | null;
  distanceKm: number;
  isActive: boolean;
  createdAt: Date;
}
