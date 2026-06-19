import { OperatingHoursInterface } from '@/domain/entities/operatingHours/operatingHours.entity.interface';

export interface GetAllOperatingHoursUseCaseInterface {
  executeGetAllOperatingHours: () => Promise<OperatingHoursInterface[]>;
}
