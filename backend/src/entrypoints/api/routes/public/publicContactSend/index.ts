import { createRoute } from '@hono/zod-openapi';

import { SendContactMessageUseCaseInterface } from '@/application/useCases/contact/sendContactMessage/sendContactMessage.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse, jsonErrorResponse, AppErrorCodes } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { ContactMessageSerializer } from '@/entrypoints/api/serializers/contactMessage.serializer';

import { publicContactSendSchema } from './schema';

const publicContactSendRoute = getHonoApp();

const route = createRoute({
  method: 'post',
  path: '/contact',
  request: {
    body: {
      content: {
        'application/json': {
          schema: publicContactSendSchema.body,
        },
      },
    },
  },
  tags: ['public', 'contact'],
  operationId: 'PublicContactSend',
  summary: 'Contact - Send a message (public)',
  responses: {
    201: jsonSuccessGetResponse(publicContactSendSchema.response),
    400: jsonErrorResponse(AppErrorCodes.BAD_REQUEST),
  },
});

publicContactSendRoute.openapi(route, async (c) => {
  const body = c.req.valid('json');

  const sendContactMessageUseCase = mainContainer.get<SendContactMessageUseCaseInterface>(
    TYPES.SendContactMessageUseCase,
  );
  const message = await sendContactMessageUseCase.executeSendContactMessage({
    name: body.name,
    email: body.email,
    phone: body.phone,
    subject: body.subject,
    message: body.message,
  });

  return c.json(ContactMessageSerializer.serialize(message), HttpStatuses.CREATED);
});

export { publicContactSendRoute };
