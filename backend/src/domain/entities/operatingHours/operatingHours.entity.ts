import { OperatingHoursInterface } from './operatingHours.entity.interface';

export class OperatingHours implements OperatingHoursInterface {
  constructor(
    public id: string,
    public dayOfWeek: number,
    public openTime: string | null,
    public closeTime: string | null,
    public isClosed: boolean,
  ) {}
}
