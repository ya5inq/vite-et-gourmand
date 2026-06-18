import { inject, injectable } from 'inversify';
import { Repository, ILike, SelectQueryBuilder } from 'typeorm';

import { UserInterface } from '@/domain/entities/user/user.entity.interface';
import {
  UserRepositoryInterface,
  FindAllUsersParamsInterface,
} from '@/domain/interfaces/repositories/user.repository.interface';
import { ClientDatabaseInterface } from '@/infrastructure/database/clientDatabase/clientDatabase.interface';

import { TYPES } from '@/configuration/di/types';
import { UserSchema } from '@/infrastructure/database/schema/user.schema';

@injectable()
export class UserRepository implements UserRepositoryInterface {
  private repository: Repository<UserInterface>;
  constructor(@inject(TYPES.ClientDatabase) clientDatabase: ClientDatabaseInterface) {
    this.repository = clientDatabase.getDataSource().getRepository(UserSchema);
  }
  async findById(id: string): Promise<UserInterface | null> {
    return this.repository.findOne({ where: { id } });
  }
  async updateOne(id: string, data: Partial<UserInterface>): Promise<void> {
    await this.repository.update(id, data);
  }

  async findByEmail(email: string): Promise<UserInterface | null> {
    return this.repository.findOne({ where: { email: ILike(email) } });
  }
  async create(user: UserInterface): Promise<void> {
    await this.repository.save(user);
  }

  async deleteOne(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  private buildFindAllQuery(params?: FindAllUsersParamsInterface): SelectQueryBuilder<UserInterface> {
    const { role, isActive, search } = params ?? {};

    const queryBuilder = this.repository.createQueryBuilder('user');

    if (role !== undefined) {
      queryBuilder.andWhere('user.role = :role', { role });
    }

    if (isActive !== undefined) {
      queryBuilder.andWhere('user.isActive = :isActive', { isActive });
    }

    if (search) {
      queryBuilder.andWhere(
        '(user.email ILIKE :search OR user.firstName ILIKE :search OR user.lastName ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    return queryBuilder;
  }

  async findAll(params?: FindAllUsersParamsInterface): Promise<UserInterface[]> {
    const { limit, offset, sortBy, sortOrder } = params ?? {};

    const queryBuilder = this.buildFindAllQuery(params);

    if (sortBy && sortOrder) {
      queryBuilder.orderBy(`user.${sortBy}`, sortOrder);
    } else {
      queryBuilder.orderBy('user.updatedAt', 'DESC');
    }

    if (limit !== undefined) {
      queryBuilder.take(limit);
    }

    if (offset !== undefined) {
      queryBuilder.skip(offset);
    }

    return queryBuilder.getMany();
  }

  async countFindAll(params?: FindAllUsersParamsInterface): Promise<number> {
    const queryBuilder = this.buildFindAllQuery(params);
    return queryBuilder.getCount();
  }
}
