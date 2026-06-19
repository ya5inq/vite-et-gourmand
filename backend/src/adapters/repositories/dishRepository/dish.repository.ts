import { inject, injectable } from 'inversify';
import { In, Repository, SelectQueryBuilder } from 'typeorm';

import { DishInterface } from '@/domain/entities/dish/dish.entity.interface';
import {
  DishRepositoryInterface,
  FindAllDishesParamsInterface,
} from '@/domain/interfaces/repositories/dish.repository.interface';
import { ClientDatabaseInterface } from '@/infrastructure/database/clientDatabase/clientDatabase.interface';

import { TYPES } from '@/configuration/di/types';
import { DishSchema } from '@/infrastructure/database/schema/dish.schema';

@injectable()
export class DishRepository implements DishRepositoryInterface {
  private repository: Repository<DishInterface>;
  constructor(@inject(TYPES.ClientDatabase) clientDatabase: ClientDatabaseInterface) {
    this.repository = clientDatabase.getDataSource().getRepository(DishSchema);
  }

  async findById(id: string): Promise<DishInterface | null> {
    return this.repository.findOne({ where: { id }, relations: ['allergens'] });
  }

  async findByIds(ids: string[]): Promise<DishInterface[]> {
    if (ids.length === 0) {
      return [];
    }
    return this.repository.find({ where: { id: In(ids) }, relations: ['allergens'] });
  }

  private buildFindAllQuery(params?: FindAllDishesParamsInterface): SelectQueryBuilder<DishInterface> {
    const { category, isAvailable, search } = params ?? {};

    const queryBuilder = this.repository.createQueryBuilder('dish');

    if (category !== undefined) {
      queryBuilder.andWhere('dish.category = :category', { category });
    }

    if (isAvailable !== undefined) {
      queryBuilder.andWhere('dish.isAvailable = :isAvailable', { isAvailable });
    }

    if (search) {
      queryBuilder.andWhere('dish.name ILIKE :search', { search: `%${search}%` });
    }

    return queryBuilder;
  }

  async findAll(params?: FindAllDishesParamsInterface): Promise<DishInterface[]> {
    const { limit, offset, sortBy, sortOrder } = params ?? {};

    const queryBuilder = this.buildFindAllQuery(params);
    queryBuilder.leftJoinAndSelect('dish.allergens', 'allergen');

    if (sortBy && sortOrder) {
      queryBuilder.orderBy(`dish.${sortBy}`, sortOrder);
    } else {
      queryBuilder.orderBy('dish.name', 'ASC');
    }

    if (limit !== undefined) {
      queryBuilder.take(limit);
    }
    if (offset !== undefined) {
      queryBuilder.skip(offset);
    }

    return queryBuilder.getMany();
  }

  async countFindAll(params?: FindAllDishesParamsInterface): Promise<number> {
    return this.buildFindAllQuery(params).getCount();
  }

  async create(dish: DishInterface): Promise<DishInterface> {
    // Drop an empty id so the database generates the uuid.
    const { id, ...dishWithoutId } = dish;
    const payload = id ? dish : (dishWithoutId as DishInterface);
    return this.repository.save(payload);
  }

  async updateOne(id: string, data: Partial<DishInterface>): Promise<void> {
    const { allergens, ...scalarData } = data;

    if (Object.keys(scalarData).length > 0) {
      await this.repository.update(id, scalarData);
    }

    // Replace allergen associations when explicitly provided.
    if (allergens !== undefined) {
      const dish = await this.repository.findOne({ where: { id }, relations: ['allergens'] });
      if (dish) {
        dish.allergens = allergens;
        await this.repository.save(dish);
      }
    }
  }

  async deleteOne(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
