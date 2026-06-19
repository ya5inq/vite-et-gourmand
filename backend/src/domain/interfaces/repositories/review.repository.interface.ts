import { ReviewInterface } from '@/domain/entities/review/review.entity.interface';

export type SortOrder = 'ASC' | 'DESC';
export type ReviewSortBy = 'createdAt' | 'updatedAt' | 'rating';

export interface FindAllReviewsParamsInterface {
  isApproved?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: ReviewSortBy;
  sortOrder?: SortOrder;
}

export interface ReviewRepositoryInterface {
  findById: (id: string) => Promise<ReviewInterface | null>;
  findByOrderId: (orderId: string) => Promise<ReviewInterface | null>;
  findAllByUser: (userId: string) => Promise<ReviewInterface[]>;
  findAll: (params?: FindAllReviewsParamsInterface) => Promise<ReviewInterface[]>;
  countFindAll: (params?: FindAllReviewsParamsInterface) => Promise<number>;
  /** Approved reviews with their author loaded (for the public homepage). */
  findApproved: (limit?: number) => Promise<ReviewInterface[]>;
  create: (review: ReviewInterface) => Promise<ReviewInterface>;
  updateOne: (id: string, data: Partial<ReviewInterface>) => Promise<void>;
  deleteOne: (id: string) => Promise<void>;
}
