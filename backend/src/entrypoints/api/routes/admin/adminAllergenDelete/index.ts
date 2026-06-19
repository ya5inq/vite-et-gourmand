import { createRoute } from '@hono/zod-openapi';

import { DeleteAllergenUseCaseInterface } from '@/application/useCases/allergen/deleteAllergen/deleteAllergen.useCase.interface';

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

import { adminAllergenDeleteSchema } from './schema';

const adminAllergenDeleteRoute = getHonoApp();

const route = createRoute({
  method: 'delete',
  path: '/allergen/{id}',
  request: {
    params: adminAllergenDeleteSchema.params,
  },
  tags: ['admin', 'allergen'],
  operationId: 'AdminAllergenDelete',
  summary: 'Allergen - Delete (admin)',
  responses: {
    200: jsonSuccessResponse(AppSuccessCodes.ENTITY_DELETED),
    401: jsonErrorResponse(AppErrorCodes.UNAUTHORIZED),
    403: jsonErrorResponse(AppErrorCodes.FORBIDDEN),
    404: jsonErrorResponse(AppErrorCodes.NOT_FOUND_ALLERGEN),
  },
});

adminAllergenDeleteRoute.openapi(route, async (c) => {
  const { id } = c.req.valid('param');

  const deleteAllergenUseCase = mainContainer.get<DeleteAllergenUseCaseInterface>(TYPES.DeleteAllergenUseCase);
  await deleteAllergenUseCase.executeDeleteAllergen(id);

  return c.json(successResponse(c, AppSuccessCodes.ENTITY_DELETED), HttpStatuses.OK);
});

export { adminAllergenDeleteRoute };
