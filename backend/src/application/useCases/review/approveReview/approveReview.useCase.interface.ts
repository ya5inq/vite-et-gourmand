import { ReviewInterface } from '@/domain/entities/review/review.entity.interface';

export interface ApproveReviewParamsInterface {
  reviewId: string;
  approvedBy: string;
  actorRole?: string | null;
}

export interface ApproveReviewUseCaseInterface {
  executeApproveReview: (params: ApproveReviewParamsInterface) => Promise<ReviewInterface>;
}
