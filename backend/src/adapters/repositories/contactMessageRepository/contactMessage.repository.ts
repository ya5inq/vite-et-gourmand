import { inject, injectable } from 'inversify';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { ContactMessageInterface } from '@/domain/entities/contactMessage/contactMessage.entity.interface';
import {
  ContactMessageRepositoryInterface,
  FindAllContactMessagesParamsInterface,
} from '@/domain/interfaces/repositories/contactMessage.repository.interface';
import { ClientDatabaseInterface } from '@/infrastructure/database/clientDatabase/clientDatabase.interface';

import { TYPES } from '@/configuration/di/types';
import { ContactMessageSchema } from '@/infrastructure/database/schema/contactMessage.schema';

@injectable()
export class ContactMessageRepository implements ContactMessageRepositoryInterface {
  private repository: Repository<ContactMessageInterface>;
  constructor(@inject(TYPES.ClientDatabase) clientDatabase: ClientDatabaseInterface) {
    this.repository = clientDatabase.getDataSource().getRepository(ContactMessageSchema);
  }

  async findById(id: string): Promise<ContactMessageInterface | null> {
    return this.repository.findOne({ where: { id } });
  }

  private buildFindAllQuery(
    params?: FindAllContactMessagesParamsInterface,
  ): SelectQueryBuilder<ContactMessageInterface> {
    const { isRead } = params ?? {};

    const queryBuilder = this.repository.createQueryBuilder('contactMessage');

    if (isRead !== undefined) {
      queryBuilder.andWhere('contactMessage.is_read = :isRead', { isRead });
    }

    return queryBuilder;
  }

  async findAll(params?: FindAllContactMessagesParamsInterface): Promise<ContactMessageInterface[]> {
    const { limit, offset, sortOrder } = params ?? {};

    const queryBuilder = this.buildFindAllQuery(params);

    queryBuilder.orderBy('contactMessage.createdAt', sortOrder ?? 'DESC');

    if (limit !== undefined) {
      queryBuilder.take(limit);
    }
    if (offset !== undefined) {
      queryBuilder.skip(offset);
    }

    return queryBuilder.getMany();
  }

  async countFindAll(params?: FindAllContactMessagesParamsInterface): Promise<number> {
    return this.buildFindAllQuery(params).getCount();
  }

  async create(message: ContactMessageInterface): Promise<ContactMessageInterface> {
    const { id, ...rest } = message;
    const payload = (id ? message : rest) as ContactMessageInterface;
    return this.repository.save(payload);
  }

  async updateOne(id: string, data: Partial<ContactMessageInterface>): Promise<void> {
    await this.repository.update(id, data);
  }

  async deleteOne(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
