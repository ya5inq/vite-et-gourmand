import { createRoute } from '@hono/zod-openapi';

import { GetContactMessagesUseCaseInterface } from '@/application/useCases/contact/getContactMessages/getContactMessages.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse, jsonErrorResponse, AppErrorCodes } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { ContactMessageSerializer } from '@/entrypoints/api/serializers/contactMessage.serializer';

import { adminContactMessageGetAllSchema } from './schema';

const adminContactMessageGetAllRoute = getHonoApp();

const route = createRoute({
  method: 'get',
  path: '/contact-message',
  request: {
    query: adminContactMessageGetAllSchema.query,
  },
  tags: ['admin', 'contact'],
  operationId: 'AdminContactMessageGetAll',
  summary: 'Contact - List contact messages (staff)',
  responses: {
    200: jsonSuccessGetResponse(adminContactMessageGetAllSchema.response),
    401: jsonErrorResponse(AppErrorCodes.UNAUTHORIZED),
    403: jsonErrorResponse(AppErrorCodes.FORBIDDEN),
  },
});

adminContactMessageGetAllRoute.openapi(route, async (c) => {
  const { isRead, limit, offset, sortOrder } = c.req.valid('query');

  const getContactMessagesUseCase = mainContainer.get<GetContactMessagesUseCaseInterface>(
    TYPES.GetContactMessagesUseCase,
  );
  const { items, totalCount } = await getContactMessagesUseCase.executeGetContactMessages({
    isRead,
    limit,
    offset,
    sortOrder,
  });

  return c.json(
    {
      items: items.map((message) => ContactMessageSerializer.serializeForList(message)),
      totalCount,
    },
    HttpStatuses.OK,
  );
});

export { adminContactMessageGetAllRoute };
