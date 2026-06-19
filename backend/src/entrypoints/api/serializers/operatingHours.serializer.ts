import { z } from 'zod';

import { OperatingHoursInterface } from '@/domain/entities/operatingHours/operatingHours.entity.interface';

/** Normalize a "HH:MM:SS" time column to "HH:MM" for the API. */
const toHourMinute = (time: string | null): string | null => (time ? time.slice(0, 5) : null);

export const OperatingHoursSchemaParser = z.object({
  id: z.string().uuid(),
  dayOfWeek: z.number().int().min(0).max(6),
  openTime: z.string().nullable(),
  closeTime: z.string().nullable(),
  isClosed: z.boolean(),
});

export type SerializedOperatingHours = z.infer<typeof OperatingHoursSchemaParser>;

export class OperatingHoursSerializer {
  static serialize(operatingHours: OperatingHoursInterface): SerializedOperatingHours {
    return OperatingHoursSchemaParser.parse({
      id: operatingHours.id,
      dayOfWeek: operatingHours.dayOfWeek,
      openTime: toHourMinute(operatingHours.openTime),
      closeTime: toHourMinute(operatingHours.closeTime),
      isClosed: operatingHours.isClosed,
    });
  }

  static serializeForList(operatingHours: OperatingHoursInterface): SerializedOperatingHours {
    return OperatingHoursSerializer.serialize(operatingHours);
  }
}
