import { createRoute } from '@hono/zod-openapi';

import { GetApprovedReviewsUseCaseInterface } from '@/application/useCases/review/getApprovedReviews/getApprovedReviews.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { ReviewSerializer } from '@/entrypoints/api/serializers/review.serializer';

import { publicReviewGetApprovedSchema } from './schema';

const publicReviewGetApprovedRoute = getHonoApp();

const route = createRoute({
  method: 'get',
  path: '/review',
  request: {
    query: publicReviewGetApprovedSchema.query,
  },
  tags: ['public', 'review'],
  operationId: 'PublicReviewGetApproved',
  summary: 'Review - List approved reviews (public)',
  responses: {
    200: jsonSuccessGetResponse(publicReviewGetApprovedSchema.response),
  },
});

publicReviewGetApprovedRoute.openapi(route, async (c) => {
  const { limit } = c.req.valid('query');

  const getApprovedReviewsUseCase = mainContainer.get<GetApprovedReviewsUseCaseInterface>(
    TYPES.GetApprovedReviewsUseCase,
  );
  const reviews = await getApprovedReviewsUseCase.executeGetApprovedReviews({ limit });

  return c.json({ items: reviews.map((review) => ReviewSerializer.serializeForPublic(review)) }, HttpStatuses.OK);
});

export { publicReviewGetApprovedRoute };
