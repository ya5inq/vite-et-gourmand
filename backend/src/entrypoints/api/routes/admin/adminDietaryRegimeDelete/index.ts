import { createRoute } from '@hono/zod-openapi';

import { DeleteDietaryRegimeUseCaseInterface } from '@/application/useCases/dietaryRegime/deleteDietaryRegime/deleteDietaryRegime.useCase.interface';

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

import { adminDietaryRegimeDeleteSchema } from './schema';

const adminDietaryRegimeDeleteRoute = getHonoApp();

const route = createRoute({
  method: 'delete',
  path: '/dietary-regime/{id}',
  request: {
    params: adminDietaryRegimeDeleteSchema.params,
  },
  tags: ['admin', 'dietary-regime'],
  operationId: 'AdminDietaryRegimeDelete',
  summary: 'Dietary Regime - Delete (admin)',
  responses: {
    200: jsonSuccessResponse(AppSuccessCodes.ENTITY_DELETED),
    401: jsonErrorResponse(AppErrorCodes.UNAUTHORIZED),
    403: jsonErrorResponse(AppErrorCodes.FORBIDDEN),
    404: jsonErrorResponse(AppErrorCodes.NOT_FOUND_DIETARY_REGIME),
  },
});

adminDietaryRegimeDeleteRoute.openapi(route, async (c) => {
  const { id } = c.req.valid('param');

  const deleteDietaryRegimeUseCase = mainContainer.get<DeleteDietaryRegimeUseCaseInterface>(
    TYPES.DeleteDietaryRegimeUseCase,
  );
  await deleteDietaryRegimeUseCase.executeDeleteDietaryRegime(id);

  return c.json(successResponse(c, AppSuccessCodes.ENTITY_DELETED), HttpStatuses.OK);
});

export { adminDietaryRegimeDeleteRoute };
