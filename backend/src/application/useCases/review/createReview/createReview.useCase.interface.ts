import { ReviewInterface } from '@/domain/entities/review/review.entity.interface';

export interface CreateReviewDataInterface {
  userId: string;
  orderId: string;
  rating: number;
  comment?: string | null;
}

export interface CreateReviewUseCaseInterface {
  executeCreateReview: (data: CreateReviewDataInterface) => Promise<ReviewInterface>;
}
