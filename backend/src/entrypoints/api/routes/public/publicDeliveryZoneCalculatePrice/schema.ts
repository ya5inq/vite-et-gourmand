import { z } from '@hono/zod-openapi';

export const publicDeliveryZoneCalculatePriceSchema = {
  body: z
    .object({
      deliveryZoneId: z.string().uuid().optional(),
      postalCode: z.string().min(1).max(20).optional(),
    })
    .refine((data) => data.deliveryZoneId !== undefined || data.postalCode !== undefined, {
      message: 'Either deliveryZoneId or postalCode must be provided',
    }),
  response: z.object({
    zoneId: z.string().uuid(),
    zoneName: z.string(),
    city: z.string().nullable(),
    distanceKm: z.number(),
    deliveryFee: z.number(),
  }),
};
