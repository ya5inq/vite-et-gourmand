import { z } from '@hono/zod-openapi';

import { ContactMessageSchemaParser } from '@/entrypoints/api/serializers/contactMessage.serializer';

export const publicContactSendSchema = {
  body: z.object({
    name: z.string().min(1).max(255),
    email: z.string().email().max(255),
    phone: z.string().max(50).optional(),
    subject: z.string().max(255).optional(),
    message: z.string().min(1).max(5000),
  }),
  response: ContactMessageSchemaParser,
};
