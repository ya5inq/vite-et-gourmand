import { createRoute } from '@hono/zod-openapi';

import { ApproveReviewUseCaseInterface } from '@/application/useCases/review/approveReview/approveReview.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse, jsonErrorResponse, AppErrorCodes } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { ReviewSerializer } from '@/entrypoints/api/serializers/review.serializer';

import { adminReviewApproveSchema } from './schema';

const adminReviewApproveRoute = getHonoApp();

const route = createRoute({
  method: 'post',
  path: '/review/{id}/approve',
  request: {
    params: adminReviewApproveSchema.params,
  },
  tags: ['admin', 'review'],
  operationId: 'AdminReviewApprove',
  summary: 'Review - Approve a review (staff)',
  responses: {
    200: jsonSuccessGetResponse(adminReviewApproveSchema.response),
    401: jsonErrorResponse(AppErrorCodes.UNAUTHORIZED),
    403: jsonErrorResponse(AppErrorCodes.FORBIDDEN),
    404: jsonErrorResponse(AppErrorCodes.NOT_FOUND_REVIEW),
  },
});

adminReviewApproveRoute.openapi(route, async (c) => {
  const currentUser = c.get('currentUser');
  const { id } = c.req.valid('param');

  const approveReviewUseCase = mainContainer.get<ApproveReviewUseCaseInterface>(TYPES.ApproveReviewUseCase);
  const review = await approveReviewUseCase.executeApproveReview({
    reviewId: id,
    approvedBy: currentUser?.id as string,
    actorRole: currentUser?.role ?? null,
  });

  return c.json(ReviewSerializer.serialize(review), HttpStatuses.OK);
});

export { adminReviewApproveRoute };
