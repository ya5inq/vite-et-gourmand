import { inject, injectable } from 'inversify';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { ReviewInterface } from '@/domain/entities/review/review.entity.interface';
import {
  FindAllReviewsParamsInterface,
  ReviewRepositoryInterface,
} from '@/domain/interfaces/repositories/review.repository.interface';
import { ClientDatabaseInterface } from '@/infrastructure/database/clientDatabase/clientDatabase.interface';

import { TYPES } from '@/configuration/di/types';
import { ReviewSchema } from '@/infrastructure/database/schema/review.schema';

@injectable()
export class ReviewRepository implements ReviewRepositoryInterface {
  private repository: Repository<ReviewInterface>;
  constructor(@inject(TYPES.ClientDatabase) clientDatabase: ClientDatabaseInterface) {
    this.repository = clientDatabase.getDataSource().getRepository(ReviewSchema);
  }

  async findById(id: string): Promise<ReviewInterface | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByOrderId(orderId: string): Promise<ReviewInterface | null> {
    return this.repository.findOne({ where: { orderId } });
  }

  async findAllByUser(userId: string): Promise<ReviewInterface[]> {
    return this.repository.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  private buildFindAllQuery(params?: FindAllReviewsParamsInterface): SelectQueryBuilder<ReviewInterface> {
    const { isApproved } = params ?? {};

    const queryBuilder = this.repository.createQueryBuilder('review');

    if (isApproved !== undefined) {
      queryBuilder.andWhere('review.is_approved = :isApproved', { isApproved });
    }

    return queryBuilder;
  }

  async findAll(params?: FindAllReviewsParamsInterface): Promise<ReviewInterface[]> {
    const { limit, offset, sortBy, sortOrder } = params ?? {};

    const queryBuilder = this.buildFindAllQuery(params);

    if (sortBy && sortOrder) {
      queryBuilder.orderBy(`review.${sortBy}`, sortOrder);
    } else {
      queryBuilder.orderBy('review.createdAt', 'DESC');
    }

    if (limit !== undefined) {
      queryBuilder.take(limit);
    }
    if (offset !== undefined) {
      queryBuilder.skip(offset);
    }

    return queryBuilder.getMany();
  }

  async countFindAll(params?: FindAllReviewsParamsInterface): Promise<number> {
    return this.buildFindAllQuery(params).getCount();
  }

  async findApproved(limit?: number): Promise<ReviewInterface[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .where('review.is_approved = :isApproved', { isApproved: true })
      .orderBy('review.createdAt', 'DESC');

    if (limit !== undefined) {
      queryBuilder.take(limit);
    }

    return queryBuilder.getMany();
  }

  async create(review: ReviewInterface): Promise<ReviewInterface> {
    const payload: Partial<ReviewInterface> = {
      userId: review.userId,
      orderId: review.orderId,
      rating: review.rating,
      comment: review.comment,
      isApproved: review.isApproved,
      approvedBy: review.approvedBy,
    };
    if (review.id) {
      payload.id = review.id;
    }
    return this.repository.save(payload as ReviewInterface);
  }

  async updateOne(id: string, data: Partial<ReviewInterface>): Promise<void> {
    await this.repository.update(id, data);
  }

  async deleteOne(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
