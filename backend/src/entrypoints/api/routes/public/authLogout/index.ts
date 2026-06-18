import { createRoute } from '@hono/zod-openapi';
import { getCookie } from 'hono/cookie';

import { LogoutUseCaseInterface } from '@/application/useCases/auth/logout/logout.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessResponse } from '@/entrypoints/api/helpers/hono.helper';
import { clearRefreshTokenCookie, REFRESH_TOKEN_COOKIE_NAME } from '@/entrypoints/api/helpers/refreshCookie.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';

import { authLogoutSchema } from './schema';

const authLogoutRoute = getHonoApp();

const route = createRoute({
  method: 'post',
  path: '/logout',
  tags: ['public', 'auth'],
  operationId: 'PublicAuthLogout',
  summary: 'Auth - Logout',
  responses: {
    200: jsonSuccessResponse('Logged out successfully', authLogoutSchema.response),
  },
});

authLogoutRoute.openapi(route, async (c) => {
  const refreshToken = getCookie(c, REFRESH_TOKEN_COOKIE_NAME);

  const logoutUseCase = mainContainer.get<LogoutUseCaseInterface>(TYPES.LogoutUseCase);
  await logoutUseCase.executeLogout(refreshToken);

  clearRefreshTokenCookie(c);

  return c.json({ message: 'Logged out successfully', code: 'LOGGED_OUT' }, HttpStatuses.OK);
});

export { authLogoutRoute };
