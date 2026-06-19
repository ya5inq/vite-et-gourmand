import { vi, Mocked } from 'vitest';

import { reviewFactory } from '@/domain/entities/review/review.factory';

import { ApproveReviewUseCaseInterface } from './approveReview.useCase.interface';

export const getApproveReviewUseCaseMock = (): Mocked<ApproveReviewUseCaseInterface> => ({
  executeApproveReview: vi.fn().mockResolvedValue(reviewFactory({ isApproved: true })),
});
