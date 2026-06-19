import { inject, injectable } from 'inversify';

import { AppErrorCodes } from '@/application/errors/app.error.interface';
import { AuditLogRepositoryInterface } from '@/domain/interfaces/adapters/auditLog.repository.interface';
import { ReviewRepositoryInterface } from '@/domain/interfaces/repositories/review.repository.interface';

import { AppError } from '@/application/errors/app.error';
import { TYPES } from '@/configuration/di/types';

import { DeleteReviewParamsInterface, DeleteReviewUseCaseInterface } from './deleteReview.useCase.interface';

@injectable()
export class DeleteReviewUseCase implements DeleteReviewUseCaseInterface {
  constructor(
    @inject(TYPES.ReviewRepository) private reviewRepository: ReviewRepositoryInterface,
    @inject(TYPES.AuditLogRepository) private auditLogRepository: AuditLogRepositoryInterface,
  ) {}

  async executeDeleteReview({ reviewId, actorId, actorRole = null }: DeleteReviewParamsInterface): Promise<void> {
    const review = await this.reviewRepository.findById(reviewId);
    if (!review) {
      throw new AppError({
        code: AppErrorCodes.NOT_FOUND_REVIEW,
        message: 'Review not found',
        privateContext: { reviewId },
      });
    }

    await this.reviewRepository.deleteOne(reviewId);

    await this.auditLogRepository.record({
      entityType: 'review',
      entityId: reviewId,
      action: 'REVIEW_DELETED',
      actorId,
      actorRole,
      before: { isApproved: review.isApproved },
      after: null,
    });
  }
}
