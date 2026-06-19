import { z } from '@hono/zod-openapi';

export const adminMenuDeleteSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
};
