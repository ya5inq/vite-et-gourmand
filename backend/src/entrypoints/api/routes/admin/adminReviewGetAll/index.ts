import { createRoute } from '@hono/zod-openapi';

import { GetAllReviewsUseCaseInterface } from '@/application/useCases/review/getAllReviews/getAllReviews.useCase.interface';
import { ReviewSortBy } from '@/domain/interfaces/repositories/review.repository.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse, jsonErrorResponse, AppErrorCodes } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { ReviewSerializer } from '@/entrypoints/api/serializers/review.serializer';

import { adminReviewGetAllSchema } from './schema';

const adminReviewGetAllRoute = getHonoApp();

const route = createRoute({
  method: 'get',
  path: '/review',
  request: {
    query: adminReviewGetAllSchema.query,
  },
  tags: ['admin', 'review'],
  operationId: 'AdminReviewGetAll',
  summary: 'Review - List all reviews for moderation (staff)',
  responses: {
    200: jsonSuccessGetResponse(adminReviewGetAllSchema.response),
    401: jsonErrorResponse(AppErrorCodes.UNAUTHORIZED),
    403: jsonErrorResponse(AppErrorCodes.FORBIDDEN),
  },
});

adminReviewGetAllRoute.openapi(route, async (c) => {
  const { isApproved, limit, offset, sortBy, sortOrder } = c.req.valid('query');

  const getAllReviewsUseCase = mainContainer.get<GetAllReviewsUseCaseInterface>(TYPES.GetAllReviewsUseCase);
  const { items, totalCount } = await getAllReviewsUseCase.executeGetAllReviews({
    isApproved,
    limit,
    offset,
    sortBy: sortBy as ReviewSortBy | undefined,
    sortOrder,
  });

  return c.json(
    {
      items: items.map((review) => ReviewSerializer.serializeForList(review)),
      totalCount,
    },
    HttpStatuses.OK,
  );
});

export { adminReviewGetAllRoute };
