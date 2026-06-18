import { createRoute } from '@hono/zod-openapi';
import { getCookie } from 'hono/cookie';

import { RefreshUseCaseInterface } from '@/application/useCases/auth/refresh/refresh.useCase.interface';

import { AppError } from '@/application/errors/app.error';
import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse, jsonErrorResponse, AppErrorCodes } from '@/entrypoints/api/helpers/hono.helper';
import { REFRESH_TOKEN_COOKIE_NAME, setRefreshTokenCookie } from '@/entrypoints/api/helpers/refreshCookie.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';

import { authRefreshSchema } from './schema';

const authRefreshRoute = getHonoApp();

const route = createRoute({
  method: 'post',
  path: '/refresh',
  request: {
    body: {
      content: {
        'application/json': {
          schema: authRefreshSchema.body,
        },
      },
    },
  },
  tags: ['public', 'auth'],
  operationId: 'PublicAuthRefresh',
  summary: 'Auth - Refresh token',
  responses: {
    200: jsonSuccessGetResponse(authRefreshSchema.response),
    400: jsonErrorResponse(AppErrorCodes.BAD_REQUEST),
    401: jsonErrorResponse(AppErrorCodes.UNAUTHORIZED),
  },
});

authRefreshRoute.openapi(route, async (c) => {
  const { accessToken: oldAccessToken } = c.req.valid('json');
  const oldRefreshToken = getCookie(c, REFRESH_TOKEN_COOKIE_NAME);

  if (!oldRefreshToken) {
    throw new AppError({
      code: AppErrorCodes.UNAUTHORIZED_TOKEN_NOT_FOUND,
      message: 'Refresh token cookie not found',
    });
  }

  const refreshUseCase = mainContainer.get<RefreshUseCaseInterface>(TYPES.RefreshUseCase);
  const { accessToken, refreshToken } = await refreshUseCase.executeRefresh(oldAccessToken, oldRefreshToken);

  setRefreshTokenCookie(c, refreshToken);

  return c.json({ accessToken }, HttpStatuses.OK);
});

export { authRefreshRoute };
