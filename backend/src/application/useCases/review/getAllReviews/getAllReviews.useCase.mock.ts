import { vi, Mocked } from 'vitest';

import { GetAllReviewsUseCaseInterface } from './getAllReviews.useCase.interface';

export const getGetAllReviewsUseCaseMock = (): Mocked<GetAllReviewsUseCaseInterface> => ({
  executeGetAllReviews: vi.fn().mockResolvedValue({ items: [], totalCount: 0 }),
});
