import { z } from '@hono/zod-openapi';

import { PublicDeliveryZoneSchemaParser } from '@/entrypoints/api/serializers/deliveryZone.serializer';

export const adminDeliveryZoneCreateSchema = {
  body: z.object({
    name: z.string().min(1).max(255),
    postalCode: z.string().max(20).nullable().optional(),
    city: z.string().max(255).nullable().optional(),
    distanceKm: z.number().min(0).optional(),
    isActive: z.boolean().optional(),
  }),
  response: PublicDeliveryZoneSchemaParser,
};
