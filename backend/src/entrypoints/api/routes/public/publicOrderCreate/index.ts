import { createRoute } from '@hono/zod-openapi';

import { CreateOrderUseCaseInterface } from '@/application/useCases/order/createOrder/createOrder.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse, jsonErrorResponse, AppErrorCodes } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { OrderSerializer } from '@/entrypoints/api/serializers/order.serializer';

import { publicOrderCreateSchema } from './schema';

const publicOrderCreateRoute = getHonoApp();

const route = createRoute({
  method: 'post',
  path: '/order',
  request: {
    body: {
      content: {
        'application/json': {
          schema: publicOrderCreateSchema.body,
        },
      },
    },
  },
  tags: ['public', 'order'],
  operationId: 'PublicOrderCreateGuest',
  summary: 'Order - Create a guest order (public)',
  responses: {
    201: jsonSuccessGetResponse(publicOrderCreateSchema.response),
    400: jsonErrorResponse([
      AppErrorCodes.BAD_REQUEST,
      AppErrorCodes.BAD_REQUEST_ORDER_BELOW_MIN_PERSONS,
      AppErrorCodes.BAD_REQUEST_ORDER_MENU_UNAVAILABLE,
    ]),
    404: jsonErrorResponse([AppErrorCodes.NOT_FOUND_MENU, AppErrorCodes.NOT_FOUND_DELIVERY_ZONE]),
    409: jsonErrorResponse(AppErrorCodes.CONFLICT_ORDER_INSUFFICIENT_STOCK),
  },
});

publicOrderCreateRoute.openapi(route, async (c) => {
  const body = c.req.valid('json');

  const createOrderUseCase = mainContainer.get<CreateOrderUseCaseInterface>(TYPES.CreateOrderUseCase);
  const order = await createOrderUseCase.executeCreateOrder({
    items: body.items,
    guestInfo: {
      guestEmail: body.guestEmail,
      guestName: body.guestName,
      guestPhone: body.guestPhone ?? null,
    },
    deliveryZoneId: body.deliveryZoneId,
    deliveryPostalCode: body.deliveryPostalCode,
    deliveryAddress: body.deliveryAddress,
    deliveryCity: body.deliveryCity,
    deliveryDate: body.deliveryDate ? new Date(body.deliveryDate) : null,
    notes: body.notes,
  });

  return c.json(OrderSerializer.serialize(order), HttpStatuses.CREATED);
});

export { publicOrderCreateRoute };
