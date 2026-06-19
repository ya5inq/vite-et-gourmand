import { z } from '@hono/zod-openapi';

import { PublicDietaryRegimeSchemaParser } from '@/entrypoints/api/serializers/dietaryRegime.serializer';

export const publicDietaryRegimeGetAllSchema = {
  response: z.object({
    items: z.array(PublicDietaryRegimeSchemaParser),
    totalCount: z.number(),
  }),
};
