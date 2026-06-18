import { Context } from 'hono';
import { deleteCookie, setCookie } from 'hono/cookie';

import { EnvConfigInterface } from '@/domain/interfaces/adapters/envConfig.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';

export const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';

/**
 * Set the httpOnly refresh-token cookie on the response.
 */
export const setRefreshTokenCookie = (c: Context, refreshToken: string): void => {
  const envConfig = mainContainer.get<EnvConfigInterface>(TYPES.EnvConfig);
  const isProduction = envConfig.nodeEnv === 'production';

  setCookie(c, REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'Lax',
    path: '/',
    maxAge: envConfig.refreshTokenExpiration,
  });
};

/**
 * Remove the refresh-token cookie from the response.
 */
export const clearRefreshTokenCookie = (c: Context): void => {
  deleteCookie(c, REFRESH_TOKEN_COOKIE_NAME, { path: '/' });
};
