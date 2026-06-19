import { vi, Mocked } from 'vitest';

import { GetApprovedReviewsUseCaseInterface } from './getApprovedReviews.useCase.interface';

export const getGetApprovedReviewsUseCaseMock = (): Mocked<GetApprovedReviewsUseCaseInterface> => ({
  executeGetApprovedReviews: vi.fn().mockResolvedValue([]),
});
