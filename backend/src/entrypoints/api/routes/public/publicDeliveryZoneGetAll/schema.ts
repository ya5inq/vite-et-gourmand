import { z } from '@hono/zod-openapi';

import { PublicDeliveryZoneSchemaParser } from '@/entrypoints/api/serializers/deliveryZone.serializer';

export const publicDeliveryZoneGetAllSchema = {
  response: z.object({
    items: z.array(PublicDeliveryZoneSchemaParser),
    totalCount: z.number(),
  }),
};
