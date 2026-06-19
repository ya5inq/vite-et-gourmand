import { createRoute } from '@hono/zod-openapi';

import { GetMyReviewsUseCaseInterface } from '@/application/useCases/review/getMyReviews/getMyReviews.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse, jsonErrorResponse, AppErrorCodes } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { ReviewSerializer } from '@/entrypoints/api/serializers/review.serializer';

import { protectedReviewGetMineSchema } from './schema';

const protectedReviewGetMineRoute = getHonoApp();

const route = createRoute({
  method: 'get',
  path: '/review',
  tags: ['protected', 'review'],
  operationId: 'ProtectedReviewGetMine',
  summary: 'Review - List the current user reviews (authenticated)',
  responses: {
    200: jsonSuccessGetResponse(protectedReviewGetMineSchema.response),
    401: jsonErrorResponse(AppErrorCodes.UNAUTHORIZED),
  },
});

protectedReviewGetMineRoute.openapi(route, async (c) => {
  const currentUser = c.get('currentUser');

  const getMyReviewsUseCase = mainContainer.get<GetMyReviewsUseCaseInterface>(TYPES.GetMyReviewsUseCase);
  const reviews = await getMyReviewsUseCase.executeGetMyReviews({ userId: currentUser?.id as string });

  return c.json({ items: reviews.map((review) => ReviewSerializer.serialize(review)) }, HttpStatuses.OK);
});

export { protectedReviewGetMineRoute };
