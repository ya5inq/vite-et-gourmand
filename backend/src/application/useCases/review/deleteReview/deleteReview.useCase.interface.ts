export interface DeleteReviewParamsInterface {
  reviewId: string;
  actorId: string | null;
  actorRole?: string | null;
}

export interface DeleteReviewUseCaseInterface {
  executeDeleteReview: (params: DeleteReviewParamsInterface) => Promise<void>;
}
