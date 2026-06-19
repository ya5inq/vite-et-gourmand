import { createRoute } from '@hono/zod-openapi';

import { CreateEmployeeUseCaseInterface } from '@/application/useCases/employee/createEmployee/createEmployee.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse, jsonErrorResponse, AppErrorCodes } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { UserSerializer } from '@/entrypoints/api/serializers/user.serializer';

import { adminEmployeeCreateSchema } from './schema';

const adminEmployeeCreateRoute = getHonoApp();

const route = createRoute({
  method: 'post',
  path: '/employee',
  request: {
    body: {
      content: {
        'application/json': {
          schema: adminEmployeeCreateSchema.body,
        },
      },
    },
  },
  tags: ['admin', 'employee'],
  operationId: 'AdminEmployeeCreate',
  summary: 'Employee - Create (admin)',
  responses: {
    201: jsonSuccessGetResponse(adminEmployeeCreateSchema.response),
    400: jsonErrorResponse(AppErrorCodes.BAD_REQUEST),
    401: jsonErrorResponse(AppErrorCodes.UNAUTHORIZED),
    403: jsonErrorResponse(AppErrorCodes.FORBIDDEN),
    409: jsonErrorResponse(AppErrorCodes.CONFLICT_EMAIL_TAKEN),
  },
});

adminEmployeeCreateRoute.openapi(route, async (c) => {
  const currentUser = c.get('currentUser');
  const body = c.req.valid('json');

  const createEmployeeUseCase = mainContainer.get<CreateEmployeeUseCaseInterface>(TYPES.CreateEmployeeUseCase);
  const employee = await createEmployeeUseCase.executeCreateEmployee({
    email: body.email,
    firstName: body.firstName,
    lastName: body.lastName,
    phone: body.phone ?? null,
    actorId: currentUser?.id ?? null,
    actorRole: currentUser?.role ?? null,
  });

  return c.json(UserSerializer.serialize(employee), HttpStatuses.CREATED);
});

export { adminEmployeeCreateRoute };
