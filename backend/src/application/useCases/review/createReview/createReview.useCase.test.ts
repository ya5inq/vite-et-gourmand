import { describe, beforeEach, vi, expect, it } from 'vitest';

import { getOrderRepositoryMock } from '@/adapters/repositories/orderRepository/order.repository.mock';
import { getReviewRepositoryMock } from '@/adapters/repositories/reviewRepository/review.repository.mock';
import { orderFactory } from '@/domain/entities/order/order.factory';
import { OrderStatusEnum } from '@/domain/entities/order/orderStatus';
import { reviewFactory } from '@/domain/entities/review/review.factory';

import { CreateReviewUseCase } from './createReview.useCase';

describe('CreateReviewUseCase', () => {
  const reviewRepositoryMock = getReviewRepositoryMock();
  const orderRepositoryMock = getOrderRepositoryMock();
  const useCase = new CreateReviewUseCase(reviewRepositoryMock, orderRepositoryMock);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a pending review on a completed order owned by the user', async () => {
    const order = orderFactory({ userId: 'user-1', status: OrderStatusEnum.COMPLETED });
    orderRepositoryMock.findById.mockResolvedValue(order);
    reviewRepositoryMock.findByOrderId.mockResolvedValue(null);
    reviewRepositoryMock.create.mockImplementation((r) => Promise.resolve(r));

    const result = await useCase.executeCreateReview({
      userId: 'user-1',
      orderId: order.id,
      rating: 5,
      comment: 'Excellent',
    });

    const created = reviewRepositoryMock.create.mock.calls[0][0];
    expect(created.isApproved).toBe(false);
    expect(created.approvedBy).toBeNull();
    expect(created.rating).toBe(5);
    expect(result.comment).toBe('Excellent');
  });

  it('throws NOT_FOUND_ORDER when the order does not exist', async () => {
    orderRepositoryMock.findById.mockResolvedValue(null);

    await expect(
      useCase.executeCreateReview({ userId: 'user-1', orderId: 'missing', rating: 4 }),
    ).rejects.toMatchObject({ code: 'NOT_FOUND_ORDER' });
  });

  it('throws FORBIDDEN_REVIEW_NOT_OWNER when the order belongs to another user', async () => {
    orderRepositoryMock.findById.mockResolvedValue(
      orderFactory({ userId: 'user-2', status: OrderStatusEnum.COMPLETED }),
    );

    await expect(
      useCase.executeCreateReview({ userId: 'user-1', orderId: 'order-1', rating: 4 }),
    ).rejects.toMatchObject({ code: 'FORBIDDEN_REVIEW_NOT_OWNER' });
  });

  it('throws BAD_REQUEST_ORDER_NOT_COMPLETED when the order is not completed', async () => {
    orderRepositoryMock.findById.mockResolvedValue(
      orderFactory({ userId: 'user-1', status: OrderStatusEnum.DELIVERING }),
    );

    await expect(
      useCase.executeCreateReview({ userId: 'user-1', orderId: 'order-1', rating: 4 }),
    ).rejects.toMatchObject({ code: 'BAD_REQUEST_ORDER_NOT_COMPLETED' });
  });

  it('throws CONFLICT_REVIEW_EXISTS when a review already exists for the order', async () => {
    const order = orderFactory({ userId: 'user-1', status: OrderStatusEnum.COMPLETED });
    orderRepositoryMock.findById.mockResolvedValue(order);
    reviewRepositoryMock.findByOrderId.mockResolvedValue(reviewFactory({ orderId: order.id }));

    await expect(useCase.executeCreateReview({ userId: 'user-1', orderId: order.id, rating: 4 })).rejects.toMatchObject(
      { code: 'CONFLICT_REVIEW_EXISTS' },
    );
  });
});
