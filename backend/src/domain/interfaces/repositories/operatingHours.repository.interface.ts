import { OperatingHoursInterface } from '@/domain/entities/operatingHours/operatingHours.entity.interface';

export interface UpsertOperatingHoursPayloadInterface {
  dayOfWeek: number;
  openTime: string | null;
  closeTime: string | null;
  isClosed: boolean;
}

export interface OperatingHoursRepositoryInterface {
  findAll: () => Promise<OperatingHoursInterface[]>;
  findByDay: (dayOfWeek: number) => Promise<OperatingHoursInterface | null>;
  /** Inserts or updates the row identified by the day_of_week unique constraint. */
  upsertByDay: (payload: UpsertOperatingHoursPayloadInterface) => Promise<OperatingHoursInterface>;
}
