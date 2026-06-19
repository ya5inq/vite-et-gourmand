import { vi, Mocked } from 'vitest';

import { ReviewInterface } from '@/domain/entities/review/review.entity.interface';
import { ReviewRepositoryInterface } from '@/domain/interfaces/repositories/review.repository.interface';

import { reviewFactory } from '@/domain/entities/review/review.factory';

export const getReviewRepositoryMock = (options?: {
  findById?: ReviewInterface | null;
  findByOrderId?: ReviewInterface | null;
  findAllByUser?: ReviewInterface[];
  findAll?: ReviewInterface[];
  countFindAll?: number;
  findApproved?: ReviewInterface[];
}): Mocked<ReviewRepositoryInterface> => ({
  findById: vi.fn().mockResolvedValue(options?.findById ?? null),
  findByOrderId: vi.fn().mockResolvedValue(options?.findByOrderId ?? null),
  findAllByUser: vi.fn().mockResolvedValue(options?.findAllByUser ?? []),
  findAll: vi.fn().mockResolvedValue(options?.findAll ?? []),
  countFindAll: vi.fn().mockResolvedValue(options?.countFindAll ?? 0),
  findApproved: vi.fn().mockResolvedValue(options?.findApproved ?? []),
  create: vi.fn().mockImplementation((review: ReviewInterface) => Promise.resolve(review ?? reviewFactory())),
  updateOne: vi.fn().mockResolvedValue(undefined),
  deleteOne: vi.fn().mockResolvedValue(undefined),
});
