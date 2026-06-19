import { z } from 'zod';

import { ReviewInterface } from '@/domain/entities/review/review.entity.interface';

export const ReviewSchemaParser = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  orderId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().nullable(),
  isApproved: z.boolean(),
  approvedBy: z.string().uuid().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

/** Public-facing review: author first name + rating + comment + date only (no email / no user id). */
export const PublicReviewSchemaParser = z.object({
  id: z.string().uuid(),
  firstName: z.string().nullable(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().nullable(),
  createdAt: z.string().datetime(),
});

export type SerializedReview = z.infer<typeof ReviewSchemaParser>;
export type SerializedPublicReview = z.infer<typeof PublicReviewSchemaParser>;

export class ReviewSerializer {
  static serialize(review: ReviewInterface): SerializedReview {
    return ReviewSchemaParser.parse({
      id: review.id,
      userId: review.userId,
      orderId: review.orderId,
      rating: review.rating,
      comment: review.comment,
      isApproved: review.isApproved,
      approvedBy: review.approvedBy,
      createdAt: review.createdAt.toISOString(),
      updatedAt: review.updatedAt.toISOString(),
    });
  }

  static serializeForList(review: ReviewInterface): SerializedReview {
    return ReviewSerializer.serialize(review);
  }

  static serializeForPublic(review: ReviewInterface): SerializedPublicReview {
    return PublicReviewSchemaParser.parse({
      id: review.id,
      firstName: review.user?.firstName ?? null,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt.toISOString(),
    });
  }
}
