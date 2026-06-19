import { inject, injectable } from 'inversify';
import { Repository } from 'typeorm';

import { OperatingHoursInterface } from '@/domain/entities/operatingHours/operatingHours.entity.interface';
import {
  OperatingHoursRepositoryInterface,
  UpsertOperatingHoursPayloadInterface,
} from '@/domain/interfaces/repositories/operatingHours.repository.interface';
import { ClientDatabaseInterface } from '@/infrastructure/database/clientDatabase/clientDatabase.interface';

import { TYPES } from '@/configuration/di/types';
import { OperatingHoursSchema } from '@/infrastructure/database/schema/operatingHours.schema';

@injectable()
export class OperatingHoursRepository implements OperatingHoursRepositoryInterface {
  private repository: Repository<OperatingHoursInterface>;
  constructor(@inject(TYPES.ClientDatabase) clientDatabase: ClientDatabaseInterface) {
    this.repository = clientDatabase.getDataSource().getRepository(OperatingHoursSchema);
  }

  async findAll(): Promise<OperatingHoursInterface[]> {
    return this.repository.find({ order: { dayOfWeek: 'ASC' } });
  }

  async findByDay(dayOfWeek: number): Promise<OperatingHoursInterface | null> {
    return this.repository.findOne({ where: { dayOfWeek } });
  }

  async upsertByDay(payload: UpsertOperatingHoursPayloadInterface): Promise<OperatingHoursInterface> {
    const { dayOfWeek, openTime, closeTime, isClosed } = payload;

    await this.repository
      .createQueryBuilder()
      .insert()
      .into(OperatingHoursSchema)
      .values({ dayOfWeek, openTime, closeTime, isClosed })
      .orUpdate(['open_time', 'close_time', 'is_closed'], ['day_of_week'])
      .execute();

    const upserted = await this.findByDay(dayOfWeek);
    if (!upserted) {
      throw new Error(`Failed to upsert operating hours for day ${dayOfWeek}`);
    }
    return upserted;
  }
}
