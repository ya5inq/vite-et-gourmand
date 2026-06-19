import { createRoute } from '@hono/zod-openapi';

import { DeleteContactMessageUseCaseInterface } from '@/application/useCases/contact/deleteContactMessage/deleteContactMessage.useCase.interface';

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

import { adminContactMessageDeleteSchema } from './schema';

const adminContactMessageDeleteRoute = getHonoApp();

const route = createRoute({
  method: 'delete',
  path: '/contact-message/{id}',
  request: {
    params: adminContactMessageDeleteSchema.params,
  },
  tags: ['admin', 'contact'],
  operationId: 'AdminContactMessageDelete',
  summary: 'Contact - Delete a message (staff)',
  responses: {
    200: jsonSuccessResponse(AppSuccessCodes.ENTITY_DELETED),
    401: jsonErrorResponse(AppErrorCodes.UNAUTHORIZED),
    403: jsonErrorResponse(AppErrorCodes.FORBIDDEN),
    404: jsonErrorResponse(AppErrorCodes.NOT_FOUND_CONTACT_MESSAGE),
  },
});

adminContactMessageDeleteRoute.openapi(route, async (c) => {
  const { id } = c.req.valid('param');

  const deleteContactMessageUseCase = mainContainer.get<DeleteContactMessageUseCaseInterface>(
    TYPES.DeleteContactMessageUseCase,
  );
  await deleteContactMessageUseCase.executeDeleteContactMessage(id);

  return c.json(successResponse(c, AppSuccessCodes.ENTITY_DELETED), HttpStatuses.OK);
});

export { adminContactMessageDeleteRoute };
