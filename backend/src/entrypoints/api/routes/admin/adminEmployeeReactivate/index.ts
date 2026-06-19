import { createRoute } from '@hono/zod-openapi';

import { ReactivateEmployeeUseCaseInterface } from '@/application/useCases/employee/reactivateEmployee/reactivateEmployee.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse, jsonErrorResponse, AppErrorCodes } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { UserSerializer } from '@/entrypoints/api/serializers/user.serializer';

import { adminEmployeeReactivateSchema } from './schema';

const adminEmployeeReactivateRoute = getHonoApp();

const route = createRoute({
  method: 'post',
  path: '/employee/{id}/reactivate',
  request: {
    params: adminEmployeeReactivateSchema.params,
  },
  tags: ['admin', 'employee'],
  operationId: 'AdminEmployeeReactivate',
  summary: 'Employee - Reactivate (admin)',
  responses: {
    200: jsonSuccessGetResponse(adminEmployeeReactivateSchema.response),
    400: jsonErrorResponse(AppErrorCodes.BAD_REQUEST_NOT_AN_EMPLOYEE),
    401: jsonErrorResponse(AppErrorCodes.UNAUTHORIZED),
    403: jsonErrorResponse(AppErrorCodes.FORBIDDEN),
    404: jsonErrorResponse(AppErrorCodes.NOT_FOUND_USER),
  },
});

adminEmployeeReactivateRoute.openapi(route, async (c) => {
  const currentUser = c.get('currentUser');
  const { id } = c.req.valid('param');

  const reactivateEmployeeUseCase = mainContainer.get<ReactivateEmployeeUseCaseInterface>(
    TYPES.ReactivateEmployeeUseCase,
  );
  const employee = await reactivateEmployeeUseCase.executeReactivateEmployee({
    employeeId: id,
    actorId: currentUser?.id ?? null,
    actorRole: currentUser?.role ?? null,
  });

  return c.json(UserSerializer.serialize(employee), HttpStatuses.OK);
});

export { adminEmployeeReactivateRoute };
