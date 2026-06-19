import { createRoute } from '@hono/zod-openapi';

import { GetAllEmployeesUseCaseInterface } from '@/application/useCases/employee/getAllEmployees/getAllEmployees.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse, jsonErrorResponse, AppErrorCodes } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { UserSerializer } from '@/entrypoints/api/serializers/user.serializer';

import { adminEmployeeGetAllSchema } from './schema';

const adminEmployeeGetAllRoute = getHonoApp();

const route = createRoute({
  method: 'get',
  path: '/employee',
  request: {
    query: adminEmployeeGetAllSchema.query,
  },
  tags: ['admin', 'employee'],
  operationId: 'AdminEmployeeGetAll',
  summary: 'Employee - List (admin)',
  responses: {
    200: jsonSuccessGetResponse(adminEmployeeGetAllSchema.response),
    401: jsonErrorResponse(AppErrorCodes.UNAUTHORIZED),
    403: jsonErrorResponse(AppErrorCodes.FORBIDDEN),
  },
});

adminEmployeeGetAllRoute.openapi(route, async (c) => {
  const { isActive, search, limit, offset, sortBy, sortOrder } = c.req.valid('query');

  const getAllEmployeesUseCase = mainContainer.get<GetAllEmployeesUseCaseInterface>(TYPES.GetAllEmployeesUseCase);
  const { items, totalCount } = await getAllEmployeesUseCase.executeGetAllEmployees({
    isActive,
    search,
    limit,
    offset,
    sortBy,
    sortOrder,
  });

  return c.json(
    {
      items: items.map((employee) => UserSerializer.serializeForList(employee)),
      totalCount,
    },
    HttpStatuses.OK,
  );
});

export { adminEmployeeGetAllRoute };
