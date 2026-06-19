import { inject, injectable } from 'inversify';

import { AppErrorCodes } from '@/application/errors/app.error.interface';
import { ReviewInterface } from '@/domain/entities/review/review.entity.interface';
import { AuditLogRepositoryInterface } from '@/domain/interfaces/adapters/auditLog.repository.interface';
import { ReviewRepositoryInterface } from '@/domain/interfaces/repositories/review.repository.interface';

import { AppError } from '@/application/errors/app.error';
import { TYPES } from '@/configuration/di/types';

import { ApproveReviewParamsInterface, ApproveReviewUseCaseInterface } from './approveReview.useCase.interface';

@injectable()
export class ApproveReviewUseCase implements ApproveReviewUseCaseInterface {
  constructor(
    @inject(TYPES.ReviewRepository) private reviewRepository: ReviewRepositoryInterface,
    @inject(TYPES.AuditLogRepository) private auditLogRepository: AuditLogRepositoryInterface,
  ) {}

  async executeApproveReview({
    reviewId,
    approvedBy,
    actorRole = null,
  }: ApproveReviewParamsInterface): Promise<ReviewInterface> {
    const review = await this.reviewRepository.findById(reviewId);
    if (!review) {
      throw new AppError({
        code: AppErrorCodes.NOT_FOUND_REVIEW,
        message: 'Review not found',
        privateContext: { reviewId },
      });
    }

    await this.reviewRepository.updateOne(reviewId, { isApproved: true, approvedBy });

    await this.auditLogRepository.record({
      entityType: 'review',
      entityId: reviewId,
      action: 'REVIEW_APPROVED',
      actorId: approvedBy,
      actorRole,
      before: { isApproved: review.isApproved },
      after: { isApproved: true },
    });

    return { ...review, isApproved: true, approvedBy };
  }
}
