import { z } from '@hono/zod-openapi';

export const adminDeliveryZoneDeleteSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
};
