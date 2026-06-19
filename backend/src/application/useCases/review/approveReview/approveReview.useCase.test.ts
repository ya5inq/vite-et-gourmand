import { describe, beforeEach, vi, expect, it } from 'vitest';

import { getAuditLogRepositoryMock } from '@/adapters/auditLog/auditLog.repository.mock';
import { getReviewRepositoryMock } from '@/adapters/repositories/reviewRepository/review.repository.mock';
import { reviewFactory } from '@/domain/entities/review/review.factory';

import { ApproveReviewUseCase } from './approveReview.useCase';

describe('ApproveReviewUseCase', () => {
  const reviewRepositoryMock = getReviewRepositoryMock();
  const auditLogRepositoryMock = getAuditLogRepositoryMock();
  const useCase = new ApproveReviewUseCase(reviewRepositoryMock, auditLogRepositoryMock);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('approves the review and records an audit log', async () => {
    const review = reviewFactory({ isApproved: false, approvedBy: null });
    reviewRepositoryMock.findById.mockResolvedValue(review);

    const result = await useCase.executeApproveReview({ reviewId: review.id, approvedBy: 'staff-1' });

    expect(reviewRepositoryMock.updateOne).toHaveBeenCalledWith(review.id, {
      isApproved: true,
      approvedBy: 'staff-1',
    });
    expect(auditLogRepositoryMock.record).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'REVIEW_APPROVED', entityId: review.id }),
    );
    expect(result.isApproved).toBe(true);
    expect(result.approvedBy).toBe('staff-1');
  });

  it('throws NOT_FOUND_REVIEW when the review does not exist', async () => {
    reviewRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.executeApproveReview({ reviewId: 'missing', approvedBy: 'staff-1' })).rejects.toMatchObject({
      code: 'NOT_FOUND_REVIEW',
    });
  });
});
