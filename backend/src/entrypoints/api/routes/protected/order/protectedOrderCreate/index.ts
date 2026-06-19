import { createRoute } from '@hono/zod-openapi';

import { CreateOrderUseCaseInterface } from '@/application/useCases/order/createOrder/createOrder.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse, jsonErrorResponse, AppErrorCodes } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { OrderSerializer } from '@/entrypoints/api/serializers/order.serializer';

import { protectedOrderCreateSchema } from './schema';

const protectedOrderCreateRoute = getHonoApp();

const route = createRoute({
  method: 'post',
  path: '/order',
  request: {
    body: {
      content: {
        'application/json': {
          schema: protectedOrderCreateSchema.body,
        },
      },
    },
  },
  tags: ['protected', 'order'],
  operationId: 'ProtectedOrderCreate',
  summary: 'Order - Create an order (authenticated)',
  responses: {
    201: jsonSuccessGetResponse(protectedOrderCreateSchema.response),
    400: jsonErrorResponse([
      AppErrorCodes.BAD_REQUEST,
      AppErrorCodes.BAD_REQUEST_ORDER_BELOW_MIN_PERSONS,
      AppErrorCodes.BAD_REQUEST_ORDER_MENU_UNAVAILABLE,
    ]),
    401: jsonErrorResponse(AppErrorCodes.UNAUTHORIZED),
    404: jsonErrorResponse([AppErrorCodes.NOT_FOUND_MENU, AppErrorCodes.NOT_FOUND_DELIVERY_ZONE]),
    409: jsonErrorResponse(AppErrorCodes.CONFLICT_ORDER_INSUFFICIENT_STOCK),
  },
});

protectedOrderCreateRoute.openapi(route, async (c) => {
  const currentUser = c.get('currentUser');
  const body = c.req.valid('json');

  const createOrderUseCase = mainContainer.get<CreateOrderUseCaseInterface>(TYPES.CreateOrderUseCase);
  const order = await createOrderUseCase.executeCreateOrder({
    items: body.items,
    userId: currentUser?.id,
    userEmail: currentUser?.email,
    deliveryZoneId: body.deliveryZoneId,
    deliveryPostalCode: body.deliveryPostalCode,
    deliveryAddress: body.deliveryAddress,
    deliveryCity: body.deliveryCity,
    deliveryDate: body.deliveryDate ? new Date(body.deliveryDate) : null,
    notes: body.notes,
  });

  return c.json(OrderSerializer.serialize(order), HttpStatuses.CREATED);
});

export { protectedOrderCreateRoute };
