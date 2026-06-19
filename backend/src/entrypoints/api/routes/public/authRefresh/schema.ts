import { z } from '@hono/zod-openapi';

export const authRefreshSchema = {
  body: z.object({
    // Optional: SSR clients refresh from the httpOnly cookie alone.
    accessToken: z.string().optional(),
  }),
  response: z.object({
    accessToken: z.string(),
  }),
};
