import { z } from '@hono/zod-openapi';

export const adminStatsRevenueByMenuSchema = {
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
        revenue: z.number(),
      }),
    ),
  }),
};
