import { createRoute } from '@hono/zod-openapi';

import { MarkContactMessageReadUseCaseInterface } from '@/application/useCases/contact/markContactMessageRead/markContactMessageRead.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse, jsonErrorResponse, AppErrorCodes } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { ContactMessageSerializer } from '@/entrypoints/api/serializers/contactMessage.serializer';

import { adminContactMessageMarkReadSchema } from './schema';

const adminContactMessageMarkReadRoute = getHonoApp();

const route = createRoute({
  method: 'post',
  path: '/contact-message/{id}/read',
  request: {
    params: adminContactMessageMarkReadSchema.params,
  },
  tags: ['admin', 'contact'],
  operationId: 'AdminContactMessageMarkRead',
  summary: 'Contact - Mark a message as read (staff)',
  responses: {
    200: jsonSuccessGetResponse(adminContactMessageMarkReadSchema.response),
    401: jsonErrorResponse(AppErrorCodes.UNAUTHORIZED),
    403: jsonErrorResponse(AppErrorCodes.FORBIDDEN),
    404: jsonErrorResponse(AppErrorCodes.NOT_FOUND_CONTACT_MESSAGE),
  },
});

adminContactMessageMarkReadRoute.openapi(route, async (c) => {
  const { id } = c.req.valid('param');

  const markContactMessageReadUseCase = mainContainer.get<MarkContactMessageReadUseCaseInterface>(
    TYPES.MarkContactMessageReadUseCase,
  );
  const message = await markContactMessageReadUseCase.executeMarkContactMessageRead({ messageId: id });

  return c.json(ContactMessageSerializer.serialize(message), HttpStatuses.OK);
});

export { adminContactMessageMarkReadRoute };
