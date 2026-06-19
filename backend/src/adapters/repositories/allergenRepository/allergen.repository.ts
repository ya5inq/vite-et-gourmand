import { inject, injectable } from 'inversify';
import { In, Repository, SelectQueryBuilder } from 'typeorm';

import { AllergenInterface } from '@/domain/entities/allergen/allergen.entity.interface';
import {
  AllergenRepositoryInterface,
  FindAllAllergensParamsInterface,
} from '@/domain/interfaces/repositories/allergen.repository.interface';
import { ClientDatabaseInterface } from '@/infrastructure/database/clientDatabase/clientDatabase.interface';

import { TYPES } from '@/configuration/di/types';
import { AllergenSchema } from '@/infrastructure/database/schema/allergen.schema';

@injectable()
export class AllergenRepository implements AllergenRepositoryInterface {
  private repository: Repository<AllergenInterface>;
  constructor(@inject(TYPES.ClientDatabase) clientDatabase: ClientDatabaseInterface) {
    this.repository = clientDatabase.getDataSource().getRepository(AllergenSchema);
  }

  async findById(id: string): Promise<AllergenInterface | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByIds(ids: string[]): Promise<AllergenInterface[]> {
    if (ids.length === 0) {
      return [];
    }
    return this.repository.find({ where: { id: In(ids) } });
  }

  private buildFindAllQuery(params?: FindAllAllergensParamsInterface): SelectQueryBuilder<AllergenInterface> {
    const { search } = params ?? {};

    const queryBuilder = this.repository.createQueryBuilder('allergen');

    if (search) {
      queryBuilder.andWhere('allergen.name ILIKE :search', { search: `%${search}%` });
    }

    return queryBuilder;
  }

  async findAll(params?: FindAllAllergensParamsInterface): Promise<AllergenInterface[]> {
    const { limit, offset, sortBy, sortOrder } = params ?? {};

    const queryBuilder = this.buildFindAllQuery(params);

    if (sortBy && sortOrder) {
      queryBuilder.orderBy(`allergen.${sortBy}`, sortOrder);
    } else {
      queryBuilder.orderBy('allergen.name', 'ASC');
    }

    if (limit !== undefined) {
      queryBuilder.take(limit);
    }
    if (offset !== undefined) {
      queryBuilder.skip(offset);
    }

    return queryBuilder.getMany();
  }

  async countFindAll(params?: FindAllAllergensParamsInterface): Promise<number> {
    return this.buildFindAllQuery(params).getCount();
  }

  async create(allergen: AllergenInterface): Promise<AllergenInterface> {
    // Drop an empty id so the database generates the uuid.
    const { id, ...allergenWithoutId } = allergen;
    const payload = id ? allergen : (allergenWithoutId as AllergenInterface);
    return this.repository.save(payload);
  }

  async updateOne(id: string, data: Partial<AllergenInterface>): Promise<void> {
    await this.repository.update(id, data);
  }

  async deleteOne(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
