import { createRoute } from '@hono/zod-openapi';

import { CreateReviewUseCaseInterface } from '@/application/useCases/review/createReview/createReview.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse, jsonErrorResponse, AppErrorCodes } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { ReviewSerializer } from '@/entrypoints/api/serializers/review.serializer';

import { protectedReviewCreateSchema } from './schema';

const protectedReviewCreateRoute = getHonoApp();

const route = createRoute({
  method: 'post',
  path: '/review',
  request: {
    body: {
      content: {
        'application/json': {
          schema: protectedReviewCreateSchema.body,
        },
      },
    },
  },
  tags: ['protected', 'review'],
  operationId: 'ProtectedReviewCreate',
  summary: 'Review - Create a review (authenticated)',
  responses: {
    201: jsonSuccessGetResponse(protectedReviewCreateSchema.response),
    400: jsonErrorResponse(AppErrorCodes.BAD_REQUEST_ORDER_NOT_COMPLETED),
    401: jsonErrorResponse(AppErrorCodes.UNAUTHORIZED),
    403: jsonErrorResponse(AppErrorCodes.FORBIDDEN_REVIEW_NOT_OWNER),
    404: jsonErrorResponse(AppErrorCodes.NOT_FOUND_ORDER),
    409: jsonErrorResponse(AppErrorCodes.CONFLICT_REVIEW_EXISTS),
  },
});

protectedReviewCreateRoute.openapi(route, async (c) => {
  const currentUser = c.get('currentUser');
  const body = c.req.valid('json');

  const createReviewUseCase = mainContainer.get<CreateReviewUseCaseInterface>(TYPES.CreateReviewUseCase);
  const review = await createReviewUseCase.executeCreateReview({
    userId: currentUser?.id as string,
    orderId: body.orderId,
    rating: body.rating,
    comment: body.comment,
  });

  return c.json(ReviewSerializer.serialize(review), HttpStatuses.CREATED);
});

export { protectedReviewCreateRoute };
