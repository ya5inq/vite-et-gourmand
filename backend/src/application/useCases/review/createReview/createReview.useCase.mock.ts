import { vi, Mocked } from 'vitest';

import { reviewFactory } from '@/domain/entities/review/review.factory';

import { CreateReviewUseCaseInterface } from './createReview.useCase.interface';

export const getCreateReviewUseCaseMock = (): Mocked<CreateReviewUseCaseInterface> => ({
  executeCreateReview: vi.fn().mockResolvedValue(reviewFactory()),
});
