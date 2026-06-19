import { createRoute } from '@hono/zod-openapi';

import { CreateDietaryRegimeUseCaseInterface } from '@/application/useCases/dietaryRegime/createDietaryRegime/createDietaryRegime.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse, jsonErrorResponse, AppErrorCodes } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { DietaryRegimeSerializer } from '@/entrypoints/api/serializers/dietaryRegime.serializer';

import { adminDietaryRegimeCreateSchema } from './schema';

const adminDietaryRegimeCreateRoute = getHonoApp();

const route = createRoute({
  method: 'post',
  path: '/dietary-regime',
  request: {
    body: {
      content: {
        'application/json': {
          schema: adminDietaryRegimeCreateSchema.body,
        },
      },
    },
  },
  tags: ['admin', 'dietary-regime'],
  operationId: 'AdminDietaryRegimeCreate',
  summary: 'Dietary Regime - Create (admin)',
  responses: {
    201: jsonSuccessGetResponse(adminDietaryRegimeCreateSchema.response),
    400: jsonErrorResponse(AppErrorCodes.BAD_REQUEST),
    401: jsonErrorResponse(AppErrorCodes.UNAUTHORIZED),
    403: jsonErrorResponse(AppErrorCodes.FORBIDDEN),
  },
});

adminDietaryRegimeCreateRoute.openapi(route, async (c) => {
  const body = c.req.valid('json');

  const createDietaryRegimeUseCase = mainContainer.get<CreateDietaryRegimeUseCaseInterface>(
    TYPES.CreateDietaryRegimeUseCase,
  );
  const regime = await createDietaryRegimeUseCase.executeCreateDietaryRegime({
    name: body.name,
    description: body.description ?? null,
  });

  return c.json(DietaryRegimeSerializer.serialize(regime), HttpStatuses.CREATED);
});

export { adminDietaryRegimeCreateRoute };
