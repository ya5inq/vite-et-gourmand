import { inject, injectable } from 'inversify';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { MenuInterface } from '@/domain/entities/menu/menu.entity.interface';
import {
  MenuRepositoryInterface,
  FindAllMenusParamsInterface,
} from '@/domain/interfaces/repositories/menu.repository.interface';
import { ClientDatabaseInterface } from '@/infrastructure/database/clientDatabase/clientDatabase.interface';

import { TYPES } from '@/configuration/di/types';
import { MenuSchema } from '@/infrastructure/database/schema/menu.schema';

@injectable()
export class MenuRepository implements MenuRepositoryInterface {
  private repository: Repository<MenuInterface>;
  constructor(@inject(TYPES.ClientDatabase) clientDatabase: ClientDatabaseInterface) {
    this.repository = clientDatabase.getDataSource().getRepository(MenuSchema);
  }

  async findById(id: string): Promise<MenuInterface | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['dishes', 'dishes.allergens', 'dietaryRegimes'],
    });
  }

  private buildFindAllQuery(params?: FindAllMenusParamsInterface): SelectQueryBuilder<MenuInterface> {
    const { theme, dietaryRegimeId, maxMinPersons, priceMin, priceMax, isAvailable, search } = params ?? {};

    const queryBuilder = this.repository.createQueryBuilder('menu');

    if (theme !== undefined) {
      queryBuilder.andWhere('menu.theme = :theme', { theme });
    }

    if (dietaryRegimeId !== undefined) {
      // Join the menu_dietary_regimes pivot to filter by a compatible regime.
      queryBuilder
        .innerJoin('menu.dietaryRegimes', 'filterRegime')
        .andWhere('filterRegime.id = :dietaryRegimeId', { dietaryRegimeId });
    }

    if (maxMinPersons !== undefined) {
      queryBuilder.andWhere('menu.minPersons <= :maxMinPersons', { maxMinPersons });
    }

    if (priceMin !== undefined) {
      queryBuilder.andWhere('menu.price >= :priceMin', { priceMin });
    }

    if (priceMax !== undefined) {
      queryBuilder.andWhere('menu.price <= :priceMax', { priceMax });
    }

    if (isAvailable !== undefined) {
      queryBuilder.andWhere('menu.isAvailable = :isAvailable', { isAvailable });
    }

    if (search) {
      queryBuilder.andWhere('menu.name ILIKE :search', { search: `%${search}%` });
    }

    return queryBuilder;
  }

  async findAll(params?: FindAllMenusParamsInterface): Promise<MenuInterface[]> {
    const { limit, offset, sortBy, sortOrder } = params ?? {};

    const queryBuilder = this.buildFindAllQuery(params)
      .leftJoinAndSelect('menu.dishes', 'dish')
      .leftJoinAndSelect('dish.allergens', 'allergen')
      .leftJoinAndSelect('menu.dietaryRegimes', 'dietaryRegime');

    if (sortBy && sortOrder) {
      queryBuilder.orderBy(`menu.${sortBy}`, sortOrder);
    } else {
      queryBuilder.orderBy('menu.name', 'ASC');
    }

    if (limit !== undefined) {
      queryBuilder.take(limit);
    }
    if (offset !== undefined) {
      queryBuilder.skip(offset);
    }

    return queryBuilder.getMany();
  }

  async countFindAll(params?: FindAllMenusParamsInterface): Promise<number> {
    return this.buildFindAllQuery(params).getCount();
  }

  async create(menu: MenuInterface): Promise<MenuInterface> {
    // Drop an empty id so the database generates the uuid.
    const { id, ...menuWithoutId } = menu;
    const payload = id ? menu : (menuWithoutId as MenuInterface);
    return this.repository.save(payload);
  }

  async updateOne(id: string, data: Partial<MenuInterface>): Promise<void> {
    const { dishes, dietaryRegimes, ...scalarData } = data;

    if (Object.keys(scalarData).length > 0) {
      await this.repository.update(id, scalarData);
    }

    // Replace M-N associations when explicitly provided.
    if (dishes !== undefined || dietaryRegimes !== undefined) {
      const menu = await this.repository.findOne({
        where: { id },
        relations: ['dishes', 'dietaryRegimes'],
      });
      if (menu) {
        if (dishes !== undefined) {
          menu.dishes = dishes;
        }
        if (dietaryRegimes !== undefined) {
          menu.dietaryRegimes = dietaryRegimes;
        }
        await this.repository.save(menu);
      }
    }
  }

  async deleteOne(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
