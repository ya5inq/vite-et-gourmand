import { z } from '@hono/zod-openapi';

export const adminStatsOrdersByMenuSchema = {
  query: z.object({
    menuId: z.string().uuid().optional(),
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional(),
  }),
  response: z.object({
    items: z.array(
      z.object({
        menuId: z.string(),
        menuName: z.string(),
        orderCount: z.number(),
        totalQuantity: z.number(),
      }),
    ),
  }),
};
