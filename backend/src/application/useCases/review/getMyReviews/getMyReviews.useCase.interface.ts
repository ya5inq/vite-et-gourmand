import { ReviewInterface } from '@/domain/entities/review/review.entity.interface';

export interface GetMyReviewsParamsInterface {
  userId: string;
}

export interface GetMyReviewsUseCaseInterface {
  executeGetMyReviews: (params: GetMyReviewsParamsInterface) => Promise<ReviewInterface[]>;
}
