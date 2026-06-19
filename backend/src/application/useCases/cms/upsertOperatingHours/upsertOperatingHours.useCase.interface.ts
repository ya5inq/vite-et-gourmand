import { OperatingHoursInterface } from '@/domain/entities/operatingHours/operatingHours.entity.interface';

export interface UpsertOperatingHoursItemInterface {
  dayOfWeek: number;
  openTime?: string | null;
  closeTime?: string | null;
  isClosed?: boolean;
}

export interface UpsertOperatingHoursDataInterface {
  /** One or several days to upsert in a single call. */
  days: UpsertOperatingHoursItemInterface[];
}

export interface UpsertOperatingHoursUseCaseInterface {
  executeUpsertOperatingHours: (data: UpsertOperatingHoursDataInterface) => Promise<OperatingHoursInterface[]>;
}
