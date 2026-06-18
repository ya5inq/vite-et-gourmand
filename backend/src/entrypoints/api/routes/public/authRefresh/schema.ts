import { z } from '@hono/zod-openapi';

export const authRefreshSchema = {
  body: z.object({
    accessToken: z.string(),
  }),
  response: z.object({
    accessToken: z.string(),
  }),
};
