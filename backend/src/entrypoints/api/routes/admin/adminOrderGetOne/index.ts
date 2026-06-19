import { createRoute } from '@hono/zod-openapi';

import { GetOrderUseCaseInterface } from '@/application/useCases/order/getOrder/getOrder.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse, jsonErrorResponse, AppErrorCodes } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { OrderSerializer } from '@/entrypoints/api/serializers/order.serializer';

import { adminOrderGetOneSchema } from './schema';

const adminOrderGetOneRoute = getHonoApp();

const route = createRoute({
  method: 'get',
  path: '/order/{id}',
  request: {
    params: adminOrderGetOneSchema.params,
  },
  tags: ['admin', 'order'],
  operationId: 'AdminOrderGetOne',
  summary: 'Order - Get an order detail (admin)',
  responses: {
    200: jsonSuccessGetResponse(adminOrderGetOneSchema.response),
    401: jsonErrorResponse(AppErrorCodes.UNAUTHORIZED),
    403: jsonErrorResponse(AppErrorCodes.FORBIDDEN),
    404: jsonErrorResponse(AppErrorCodes.NOT_FOUND_ORDER),
  },
});

adminOrderGetOneRoute.openapi(route, async (c) => {
  const { id } = c.req.valid('param');

  const getOrderUseCase = mainContainer.get<GetOrderUseCaseInterface>(TYPES.GetOrderUseCase);
  const order = await getOrderUseCase.executeGetOrder({ orderId: id, isStaff: true });

  return c.json(OrderSerializer.serializeDetail(order), HttpStatuses.OK);
});

export { adminOrderGetOneRoute };
