import { vi, Mocked } from 'vitest';

import { GetMyReviewsUseCaseInterface } from './getMyReviews.useCase.interface';

export const getGetMyReviewsUseCaseMock = (): Mocked<GetMyReviewsUseCaseInterface> => ({
  executeGetMyReviews: vi.fn().mockResolvedValue([]),
});
