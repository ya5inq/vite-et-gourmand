import { inject, injectable } from 'inversify';
import { In, Repository, SelectQueryBuilder } from 'typeorm';

import { DietaryRegimeInterface } from '@/domain/entities/dietaryRegime/dietaryRegime.entity.interface';
import {
  DietaryRegimeRepositoryInterface,
  FindAllDietaryRegimesParamsInterface,
} from '@/domain/interfaces/repositories/dietaryRegime.repository.interface';
import { ClientDatabaseInterface } from '@/infrastructure/database/clientDatabase/clientDatabase.interface';

import { TYPES } from '@/configuration/di/types';
import { DietaryRegimeSchema } from '@/infrastructure/database/schema/dietaryRegime.schema';

@injectable()
export class DietaryRegimeRepository implements DietaryRegimeRepositoryInterface {
  private repository: Repository<DietaryRegimeInterface>;
  constructor(@inject(TYPES.ClientDatabase) clientDatabase: ClientDatabaseInterface) {
    this.repository = clientDatabase.getDataSource().getRepository(DietaryRegimeSchema);
  }

  async findById(id: string): Promise<DietaryRegimeInterface | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByIds(ids: string[]): Promise<DietaryRegimeInterface[]> {
    if (ids.length === 0) {
      return [];
    }
    return this.repository.find({ where: { id: In(ids) } });
  }

  private buildFindAllQuery(params?: FindAllDietaryRegimesParamsInterface): SelectQueryBuilder<DietaryRegimeInterface> {
    const { search } = params ?? {};

    const queryBuilder = this.repository.createQueryBuilder('dietaryRegime');

    if (search) {
      queryBuilder.andWhere('dietaryRegime.name ILIKE :search', { search: `%${search}%` });
    }

    return queryBuilder;
  }

  async findAll(params?: FindAllDietaryRegimesParamsInterface): Promise<DietaryRegimeInterface[]> {
    const { limit, offset, sortBy, sortOrder } = params ?? {};

    const queryBuilder = this.buildFindAllQuery(params);

    if (sortBy && sortOrder) {
      queryBuilder.orderBy(`dietaryRegime.${sortBy}`, sortOrder);
    } else {
      queryBuilder.orderBy('dietaryRegime.name', 'ASC');
    }

    if (limit !== undefined) {
      queryBuilder.take(limit);
    }
    if (offset !== undefined) {
      queryBuilder.skip(offset);
    }

    return queryBuilder.getMany();
  }

  async countFindAll(params?: FindAllDietaryRegimesParamsInterface): Promise<number> {
    return this.buildFindAllQuery(params).getCount();
  }

  async create(dietaryRegime: DietaryRegimeInterface): Promise<DietaryRegimeInterface> {
    // Drop an empty id so the database generates the uuid.
    const { id, ...regimeWithoutId } = dietaryRegime;
    const payload = id ? dietaryRegime : (regimeWithoutId as DietaryRegimeInterface);
    return this.repository.save(payload);
  }

  async updateOne(id: string, data: Partial<DietaryRegimeInterface>): Promise<void> {
    await this.repository.update(id, data);
  }

  async deleteOne(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
