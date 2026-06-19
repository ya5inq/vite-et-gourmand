import { z } from '@hono/zod-openapi';

import { OrderSchemaParser } from '@/entrypoints/api/serializers/order.serializer';

export const protectedOrderCreateSchema = {
  body: z
    .object({
      items: z
        .array(
          z.object({
            menuId: z.string().uuid(),
            quantity: z.number().int().min(1),
          }),
        )
        .min(1),
      deliveryZoneId: z.string().uuid().optional(),
      deliveryPostalCode: z.string().min(1).max(20).optional(),
      deliveryAddress: z.string().max(255).optional(),
      deliveryCity: z.string().max(255).optional(),
      deliveryDate: z.string().date().optional(),
      notes: z.string().max(2000).optional(),
    })
    .refine((data) => data.deliveryZoneId !== undefined || data.deliveryPostalCode !== undefined, {
      message: 'Either deliveryZoneId or deliveryPostalCode must be provided',
    }),
  response: OrderSchemaParser,
};
