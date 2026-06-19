import { inject, injectable } from 'inversify';

import { AppErrorCodes } from '@/application/errors/app.error.interface';
import { ReviewInterface } from '@/domain/entities/review/review.entity.interface';
import { OrderRepositoryInterface } from '@/domain/interfaces/repositories/order.repository.interface';
import { ReviewRepositoryInterface } from '@/domain/interfaces/repositories/review.repository.interface';

import { AppError } from '@/application/errors/app.error';
import { TYPES } from '@/configuration/di/types';
import { OrderStatusEnum } from '@/domain/entities/order/orderStatus';
import { Review } from '@/domain/entities/review/review.entity';

import { CreateReviewDataInterface, CreateReviewUseCaseInterface } from './createReview.useCase.interface';

@injectable()
export class CreateReviewUseCase implements CreateReviewUseCaseInterface {
  constructor(
    @inject(TYPES.ReviewRepository) private reviewRepository: ReviewRepositoryInterface,
    @inject(TYPES.OrderRepository) private orderRepository: OrderRepositoryInterface,
  ) {}

  async executeCreateReview(data: CreateReviewDataInterface): Promise<ReviewInterface> {
    const { userId, orderId, rating, comment } = data;

    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new AppError({
        code: AppErrorCodes.NOT_FOUND_ORDER,
        message: 'Order not found',
        privateContext: { orderId },
      });
    }

    if (order.userId !== userId) {
      throw new AppError({
        code: AppErrorCodes.FORBIDDEN_REVIEW_NOT_OWNER,
        message: 'Order does not belong to the reviewer',
        privateContext: { orderId, userId, ownerId: order.userId },
      });
    }

    if (order.status !== OrderStatusEnum.COMPLETED) {
      throw new AppError({
        code: AppErrorCodes.BAD_REQUEST_ORDER_NOT_COMPLETED,
        message: 'A review can only be left on a completed order',
        privateContext: { orderId, status: order.status },
      });
    }

    const existing = await this.reviewRepository.findByOrderId(orderId);
    if (existing) {
      throw new AppError({
        code: AppErrorCodes.CONFLICT_REVIEW_EXISTS,
        message: 'A review already exists for this order',
        privateContext: { orderId },
      });
    }

    const now = new Date();
    const review = new Review('', userId, orderId, rating, comment ?? null, false, null, now, now);

    return this.reviewRepository.create(review);
  }
}
