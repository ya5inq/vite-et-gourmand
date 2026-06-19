import { inject, injectable } from 'inversify';

import { ReviewInterface } from '@/domain/entities/review/review.entity.interface';
import { ReviewRepositoryInterface } from '@/domain/interfaces/repositories/review.repository.interface';

import { TYPES } from '@/configuration/di/types';

import { GetMyReviewsParamsInterface, GetMyReviewsUseCaseInterface } from './getMyReviews.useCase.interface';

@injectable()
export class GetMyReviewsUseCase implements GetMyReviewsUseCaseInterface {
  constructor(@inject(TYPES.ReviewRepository) private reviewRepository: ReviewRepositoryInterface) {}

  async executeGetMyReviews({ userId }: GetMyReviewsParamsInterface): Promise<ReviewInterface[]> {
    return this.reviewRepository.findAllByUser(userId);
  }
}
