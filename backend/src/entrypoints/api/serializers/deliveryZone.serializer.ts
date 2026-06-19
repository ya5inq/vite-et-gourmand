import { z } from 'zod';

import { DeliveryZoneInterface } from '@/domain/entities/deliveryZone/deliveryZone.entity.interface';

export const PublicDeliveryZoneSchemaParser = z.object({
  id: z.string().uuid(),
  name: z.string(),
  postalCode: z.string().nullable(),
  city: z.string().nullable(),
  distanceKm: z.number(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
});

export type PublicDeliveryZone = z.infer<typeof PublicDeliveryZoneSchemaParser>;

export class DeliveryZoneSerializer {
  static serialize(deliveryZone: DeliveryZoneInterface): PublicDeliveryZone {
    return PublicDeliveryZoneSchemaParser.parse({
      id: deliveryZone.id,
      name: deliveryZone.name,
      postalCode: deliveryZone.postalCode,
      city: deliveryZone.city,
      distanceKm: deliveryZone.distanceKm,
      isActive: deliveryZone.isActive,
      createdAt: deliveryZone.createdAt.toISOString(),
    });
  }

  static serializeForList(deliveryZone: DeliveryZoneInterface): PublicDeliveryZone {
    return DeliveryZoneSerializer.serialize(deliveryZone);
  }
}
