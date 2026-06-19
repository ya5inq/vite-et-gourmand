export interface OperatingHoursInterface {
  id: string;
  /** 0 = Sunday, 1 = Monday, ..., 6 = Saturday (PostgreSQL convention). */
  dayOfWeek: number;
  /** Opening time as "HH:MM" (null when closed). */
  openTime: string | null;
  /** Closing time as "HH:MM" (null when closed). */
  closeTime: string | null;
  isClosed: boolean;
}
