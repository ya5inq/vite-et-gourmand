import { inject, injectable } from 'inversify';

import { ReviewInterface } from '@/domain/entities/review/review.entity.interface';
import { ReviewRepositoryInterface } from '@/domain/interfaces/repositories/review.repository.interface';

import { TYPES } from '@/configuration/di/types';

import {
  GetApprovedReviewsParamsInterface,
  GetApprovedReviewsUseCaseInterface,
} from './getApprovedReviews.useCase.interface';

@injectable()
export class GetApprovedReviewsUseCase implements GetApprovedReviewsUseCaseInterface {
  constructor(@inject(TYPES.ReviewRepository) private reviewRepository: ReviewRepositoryInterface) {}

  async executeGetApprovedReviews(params?: GetApprovedReviewsParamsInterface): Promise<ReviewInterface[]> {
    return this.reviewRepository.findApproved(params?.limit);
  }
}
