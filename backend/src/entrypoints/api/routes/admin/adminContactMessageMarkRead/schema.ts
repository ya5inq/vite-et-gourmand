import { z } from '@hono/zod-openapi';

import { ContactMessageSchemaParser } from '@/entrypoints/api/serializers/contactMessage.serializer';

export const adminContactMessageMarkReadSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
  response: ContactMessageSchemaParser,
};
