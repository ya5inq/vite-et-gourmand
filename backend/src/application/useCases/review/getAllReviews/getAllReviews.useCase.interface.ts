import { ReviewInterface } from '@/domain/entities/review/review.entity.interface';
import { FindAllReviewsParamsInterface } from '@/domain/interfaces/repositories/review.repository.interface';

export type GetAllReviewsParamsInterface = FindAllReviewsParamsInterface;

export interface GetAllReviewsResultInterface {
  items: ReviewInterface[];
  totalCount: number;
}

export interface GetAllReviewsUseCaseInterface {
  executeGetAllReviews: (params: GetAllReviewsParamsInterface) => Promise<GetAllReviewsResultInterface>;
}
