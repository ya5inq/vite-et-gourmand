import { inject, injectable } from 'inversify';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { DeliveryZoneInterface } from '@/domain/entities/deliveryZone/deliveryZone.entity.interface';
import {
  DeliveryZoneRepositoryInterface,
  FindAllDeliveryZonesParamsInterface,
} from '@/domain/interfaces/repositories/deliveryZone.repository.interface';
import { ClientDatabaseInterface } from '@/infrastructure/database/clientDatabase/clientDatabase.interface';

import { TYPES } from '@/configuration/di/types';
import { DeliveryZoneSchema } from '@/infrastructure/database/schema/deliveryZone.schema';

@injectable()
export class DeliveryZoneRepository implements DeliveryZoneRepositoryInterface {
  private repository: Repository<DeliveryZoneInterface>;
  constructor(@inject(TYPES.ClientDatabase) clientDatabase: ClientDatabaseInterface) {
    this.repository = clientDatabase.getDataSource().getRepository(DeliveryZoneSchema);
  }

  async findById(id: string): Promise<DeliveryZoneInterface | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByPostalCode(postalCode: string): Promise<DeliveryZoneInterface | null> {
    return this.repository.findOne({ where: { postalCode } });
  }

  private buildFindAllQuery(params?: FindAllDeliveryZonesParamsInterface): SelectQueryBuilder<DeliveryZoneInterface> {
    const { search, isActive } = params ?? {};

    const queryBuilder = this.repository.createQueryBuilder('deliveryZone');

    if (isActive !== undefined) {
      queryBuilder.andWhere('deliveryZone.is_active = :isActive', { isActive });
    }

    if (search) {
      queryBuilder.andWhere('(deliveryZone.name ILIKE :search OR deliveryZone.city ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    return queryBuilder;
  }

  async findAll(params?: FindAllDeliveryZonesParamsInterface): Promise<DeliveryZoneInterface[]> {
    const { limit, offset, sortBy, sortOrder } = params ?? {};

    const queryBuilder = this.buildFindAllQuery(params);

    if (sortBy && sortOrder) {
      queryBuilder.orderBy(`deliveryZone.${sortBy}`, sortOrder);
    } else {
      queryBuilder.orderBy('deliveryZone.name', 'ASC');
    }

    if (limit !== undefined) {
      queryBuilder.take(limit);
    }
    if (offset !== undefined) {
      queryBuilder.skip(offset);
    }

    return queryBuilder.getMany();
  }

  async countFindAll(params?: FindAllDeliveryZonesParamsInterface): Promise<number> {
    return this.buildFindAllQuery(params).getCount();
  }

  async create(deliveryZone: DeliveryZoneInterface): Promise<DeliveryZoneInterface> {
    // Drop an empty id so the database generates the uuid.
    const { id, ...deliveryZoneWithoutId } = deliveryZone;
    const payload = id ? deliveryZone : (deliveryZoneWithoutId as DeliveryZoneInterface);
    return this.repository.save(payload);
  }

  async updateOne(id: string, data: Partial<DeliveryZoneInterface>): Promise<void> {
    await this.repository.update(id, data);
  }

  async deleteOne(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
