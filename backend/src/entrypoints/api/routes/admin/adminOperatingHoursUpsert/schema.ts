import { z } from '@hono/zod-openapi';

import { OperatingHoursSchemaParser } from '@/entrypoints/api/serializers/operatingHours.serializer';

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

export const adminOperatingHoursUpsertSchema = {
  body: z.object({
    days: z
      .array(
        z.object({
          dayOfWeek: z.number().int().min(0).max(6),
          openTime: z.string().regex(timeRegex).nullable().optional(),
          closeTime: z.string().regex(timeRegex).nullable().optional(),
          isClosed: z.boolean().optional(),
        }),
      )
      .min(1),
  }),
  response: z.object({
    items: z.array(OperatingHoursSchemaParser),
  }),
};
