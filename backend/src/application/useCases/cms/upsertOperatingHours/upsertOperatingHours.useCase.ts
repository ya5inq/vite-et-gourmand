import { inject, injectable } from 'inversify';

import { OperatingHoursInterface } from '@/domain/entities/operatingHours/operatingHours.entity.interface';
import { OperatingHoursRepositoryInterface } from '@/domain/interfaces/repositories/operatingHours.repository.interface';

import { TYPES } from '@/configuration/di/types';

import {
  UpsertOperatingHoursDataInterface,
  UpsertOperatingHoursUseCaseInterface,
} from './upsertOperatingHours.useCase.interface';

@injectable()
export class UpsertOperatingHoursUseCase implements UpsertOperatingHoursUseCaseInterface {
  constructor(
    @inject(TYPES.OperatingHoursRepository) private operatingHoursRepository: OperatingHoursRepositoryInterface,
  ) {}

  async executeUpsertOperatingHours(data: UpsertOperatingHoursDataInterface): Promise<OperatingHoursInterface[]> {
    const results: OperatingHoursInterface[] = [];

    for (const day of data.days) {
      const isClosed = day.isClosed ?? false;
      const result = await this.operatingHoursRepository.upsertByDay({
        dayOfWeek: day.dayOfWeek,
        openTime: isClosed ? null : day.openTime ?? null,
        closeTime: isClosed ? null : day.closeTime ?? null,
        isClosed,
      });
      results.push(result);
    }

    return results;
  }
}
