import { createRoute } from '@hono/zod-openapi';

import { GetOrderUseCaseInterface } from '@/application/useCases/order/getOrder/getOrder.useCase.interface';
import { isStaffRole } from '@/domain/entities/user/user.entity.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse, jsonErrorResponse, AppErrorCodes } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { OrderSerializer } from '@/entrypoints/api/serializers/order.serializer';

import { protectedOrderGetOneSchema } from './schema';

const protectedOrderGetOneRoute = getHonoApp();

const route = createRoute({
  method: 'get',
  path: '/order/{id}',
  request: {
    params: protectedOrderGetOneSchema.params,
  },
  tags: ['protected', 'order'],
  operationId: 'ProtectedOrderGetOne',
  summary: 'Order - Get an order detail (authenticated, owner or staff)',
  responses: {
    200: jsonSuccessGetResponse(protectedOrderGetOneSchema.response),
    401: jsonErrorResponse(AppErrorCodes.UNAUTHORIZED),
    403: jsonErrorResponse(AppErrorCodes.FORBIDDEN_ORDER_NOT_OWNER),
    404: jsonErrorResponse(AppErrorCodes.NOT_FOUND_ORDER),
  },
});

protectedOrderGetOneRoute.openapi(route, async (c) => {
  const currentUser = c.get('currentUser');
  const { id } = c.req.valid('param');

  const getOrderUseCase = mainContainer.get<GetOrderUseCaseInterface>(TYPES.GetOrderUseCase);
  const order = await getOrderUseCase.executeGetOrder({
    orderId: id,
    requesterId: currentUser?.id,
    isStaff: currentUser ? isStaffRole(currentUser.role) : false,
  });

  return c.json(OrderSerializer.serialize(order), HttpStatuses.OK);
});

export { protectedOrderGetOneRoute };
