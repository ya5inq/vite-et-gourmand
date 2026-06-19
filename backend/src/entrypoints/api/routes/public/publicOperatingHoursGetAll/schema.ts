import { z } from '@hono/zod-openapi';

import { OperatingHoursSchemaParser } from '@/entrypoints/api/serializers/operatingHours.serializer';

export const publicOperatingHoursGetAllSchema = {
  response: z.object({
    items: z.array(OperatingHoursSchemaParser),
  }),
};
