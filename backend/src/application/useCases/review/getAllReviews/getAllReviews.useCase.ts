import { inject, injectable } from 'inversify';

import { ReviewRepositoryInterface } from '@/domain/interfaces/repositories/review.repository.interface';

import { TYPES } from '@/configuration/di/types';

import {
  GetAllReviewsParamsInterface,
  GetAllReviewsResultInterface,
  GetAllReviewsUseCaseInterface,
} from './getAllReviews.useCase.interface';

@injectable()
export class GetAllReviewsUseCase implements GetAllReviewsUseCaseInterface {
  constructor(@inject(TYPES.ReviewRepository) private reviewRepository: ReviewRepositoryInterface) {}

  async executeGetAllReviews(params: GetAllReviewsParamsInterface): Promise<GetAllReviewsResultInterface> {
    const [items, totalCount] = await Promise.all([
      this.reviewRepository.findAll(params),
      this.reviewRepository.countFindAll(params),
    ]);

    return { items, totalCount };
  }
}
