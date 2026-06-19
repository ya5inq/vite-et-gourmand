import { createRoute } from '@hono/zod-openapi';

import { UpdateDietaryRegimeUseCaseInterface } from '@/application/useCases/dietaryRegime/updateDietaryRegime/updateDietaryRegime.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse, jsonErrorResponse, AppErrorCodes } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { DietaryRegimeSerializer } from '@/entrypoints/api/serializers/dietaryRegime.serializer';

import { adminDietaryRegimeUpdateSchema } from './schema';

const adminDietaryRegimeUpdateRoute = getHonoApp();

const route = createRoute({
  method: 'put',
  path: '/dietary-regime/{id}',
  request: {
    params: adminDietaryRegimeUpdateSchema.params,
    body: {
      content: {
        'application/json': {
          schema: adminDietaryRegimeUpdateSchema.body,
        },
      },
    },
  },
  tags: ['admin', 'dietary-regime'],
  operationId: 'AdminDietaryRegimeUpdate',
  summary: 'Dietary Regime - Update (admin)',
  responses: {
    200: jsonSuccessGetResponse(adminDietaryRegimeUpdateSchema.response),
    400: jsonErrorResponse(AppErrorCodes.BAD_REQUEST),
    401: jsonErrorResponse(AppErrorCodes.UNAUTHORIZED),
    403: jsonErrorResponse(AppErrorCodes.FORBIDDEN),
    404: jsonErrorResponse(AppErrorCodes.NOT_FOUND_DIETARY_REGIME),
  },
});

adminDietaryRegimeUpdateRoute.openapi(route, async (c) => {
  const { id } = c.req.valid('param');
  const body = c.req.valid('json');

  const updateDietaryRegimeUseCase = mainContainer.get<UpdateDietaryRegimeUseCaseInterface>(
    TYPES.UpdateDietaryRegimeUseCase,
  );
  const regime = await updateDietaryRegimeUseCase.executeUpdateDietaryRegime({ id, data: body });

  return c.json(DietaryRegimeSerializer.serialize(regime), HttpStatuses.OK);
});

export { adminDietaryRegimeUpdateRoute };
