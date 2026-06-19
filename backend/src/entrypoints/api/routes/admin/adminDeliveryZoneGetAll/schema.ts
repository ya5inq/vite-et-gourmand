import { z } from '@hono/zod-openapi';

import { PublicDeliveryZoneSchemaParser } from '@/entrypoints/api/serializers/deliveryZone.serializer';

export const adminDeliveryZoneGetAllSchema = {
  query: z.object({
    search: z.string().optional(),
    isActive: z.enum(['true', 'false']).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    offset: z.coerce.number().int().min(0).optional(),
    sortBy: z.enum(['name', 'city', 'distanceKm', 'createdAt']).optional(),
    sortOrder: z.enum(['ASC', 'DESC']).optional(),
  }),
  response: z.object({
    items: z.array(PublicDeliveryZoneSchemaParser),
    totalCount: z.number(),
  }),
};
