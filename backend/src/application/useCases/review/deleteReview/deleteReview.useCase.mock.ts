import { vi, Mocked } from 'vitest';

import { DeleteReviewUseCaseInterface } from './deleteReview.useCase.interface';

export const getDeleteReviewUseCaseMock = (): Mocked<DeleteReviewUseCaseInterface> => ({
  executeDeleteReview: vi.fn().mockResolvedValue(undefined),
});
