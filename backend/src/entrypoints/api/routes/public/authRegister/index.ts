import { createRoute } from '@hono/zod-openapi';

import { RegisterUseCaseInterface } from '@/application/useCases/auth/register/register.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessResponse, jsonErrorResponse, AppErrorCodes } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';

import { authRegisterSchema } from './schema';

const authRegisterRoute = getHonoApp();

const route = createRoute({
  method: 'post',
  path: '/register',
  request: {
    body: {
      content: {
        'application/json': {
          schema: authRegisterSchema.body,
        },
      },
    },
  },
  tags: ['public', 'auth'],
  operationId: 'PublicAuthRegister',
  summary: 'Auth - Register',
  responses: {
    201: jsonSuccessResponse('User created successfully', authRegisterSchema.response),
    400: jsonErrorResponse(AppErrorCodes.BAD_REQUEST),
    409: jsonErrorResponse(AppErrorCodes.CONFLICT_EMAIL_TAKEN),
  },
});

authRegisterRoute.openapi(route, async (c) => {
  const { email, password, firstName, lastName, phone, address, city, postalCode } = c.req.valid('json');

  const registerUseCase = mainContainer.get<RegisterUseCaseInterface>(TYPES.RegisterUseCase);
  await registerUseCase.executeRegister({
    email,
    password,
    firstName,
    lastName,
    phone: phone ?? null,
    address: address ?? null,
    city: city ?? null,
    postalCode: postalCode ?? null,
  });

  return c.json({ code: 'USER_CREATED', message: 'User created successfully' }, HttpStatuses.CREATED);
});

export { authRegisterRoute };
