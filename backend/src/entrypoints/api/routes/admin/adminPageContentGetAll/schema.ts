import { z } from '@hono/zod-openapi';

import { PageContentSchemaParser } from '@/entrypoints/api/serializers/pageContent.serializer';

export const adminPageContentGetAllSchema = {
  query: z.object({
    page: z.string().min(1).max(100).optional(),
  }),
  response: z.object({
    items: z.array(PageContentSchemaParser),
  }),
};
