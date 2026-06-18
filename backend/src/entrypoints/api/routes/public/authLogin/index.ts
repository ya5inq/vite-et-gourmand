import { createRoute } from '@hono/zod-openapi';

import { LoginUseCaseInterface } from '@/application/useCases/auth/login/login.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse, jsonErrorResponse, AppErrorCodes } from '@/entrypoints/api/helpers/hono.helper';
import { setRefreshTokenCookie } from '@/entrypoints/api/helpers/refreshCookie.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';

import { authLoginSchema } from './schema';

const authLoginRoute = getHonoApp();

const route = createRoute({
  method: 'post',
  path: '/login',
  request: {
    body: {
      content: {
        'application/json': {
          schema: authLoginSchema.body,
        },
      },
    },
  },
  tags: ['public', 'auth'],
  operationId: 'PublicAuthLogin',
  summary: 'Auth - Login',
  responses: {
    200: jsonSuccessGetResponse(authLoginSchema.response),
    400: jsonErrorResponse(AppErrorCodes.BAD_REQUEST),
    401: jsonErrorResponse(AppErrorCodes.UNAUTHORIZED),
    404: jsonErrorResponse(AppErrorCodes.NOT_FOUND),
  },
});

authLoginRoute.openapi(route, async (c) => {
  const { email, password } = c.req.valid('json');

  const loginUseCase = mainContainer.get<LoginUseCaseInterface>(TYPES.LoginUseCase);
  const { accessToken, refreshToken } = await loginUseCase.executeLogin(email, password);

  setRefreshTokenCookie(c, refreshToken);

  return c.json({ accessToken }, HttpStatuses.OK);
});

export { authLoginRoute };
