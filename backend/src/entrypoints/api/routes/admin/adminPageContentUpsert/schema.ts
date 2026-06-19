import { z } from '@hono/zod-openapi';

import { PageContentSchemaParser } from '@/entrypoints/api/serializers/pageContent.serializer';

export const adminPageContentUpsertSchema = {
  body: z.object({
    page: z.string().min(1).max(100),
    section: z.string().min(1).max(100),
    content: z.record(z.unknown()),
  }),
  response: PageContentSchemaParser,
};
