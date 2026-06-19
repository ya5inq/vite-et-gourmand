import { createRoute } from '@hono/zod-openapi';

import { DeleteReviewUseCaseInterface } from '@/application/useCases/review/deleteReview/deleteReview.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import {
  jsonSuccessResponse,
  jsonErrorResponse,
  AppErrorCodes,
  AppSuccessCodes,
} from '@/entrypoints/api/helpers/hono.helper';
import { successResponse } from '@/entrypoints/api/helpers/response.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';

import { adminReviewDeleteSchema } from './schema';

const adminReviewDeleteRoute = getHonoApp();

const route = createRoute({
  method: 'delete',
  path: '/review/{id}',
  request: {
    params: adminReviewDeleteSchema.params,
  },
  tags: ['admin', 'review'],
  operationId: 'AdminReviewDelete',
  summary: 'Review - Delete a review (staff)',
  responses: {
    200: jsonSuccessResponse(AppSuccessCodes.ENTITY_DELETED),
    401: jsonErrorResponse(AppErrorCodes.UNAUTHORIZED),
    403: jsonErrorResponse(AppErrorCodes.FORBIDDEN),
    404: jsonErrorResponse(AppErrorCodes.NOT_FOUND_REVIEW),
  },
});

adminReviewDeleteRoute.openapi(route, async (c) => {
  const currentUser = c.get('currentUser');
  const { id } = c.req.valid('param');

  const deleteReviewUseCase = mainContainer.get<DeleteReviewUseCaseInterface>(TYPES.DeleteReviewUseCase);
  await deleteReviewUseCase.executeDeleteReview({
    reviewId: id,
    actorId: currentUser?.id ?? null,
    actorRole: currentUser?.role ?? null,
  });

  return c.json(successResponse(c, AppSuccessCodes.ENTITY_DELETED), HttpStatuses.OK);
});

export { adminReviewDeleteRoute };
