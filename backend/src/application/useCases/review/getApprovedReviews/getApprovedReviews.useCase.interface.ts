import { ReviewInterface } from '@/domain/entities/review/review.entity.interface';

export interface GetApprovedReviewsParamsInterface {
  limit?: number;
}

export interface GetApprovedReviewsUseCaseInterface {
  executeGetApprovedReviews: (params?: GetApprovedReviewsParamsInterface) => Promise<ReviewInterface[]>;
}
