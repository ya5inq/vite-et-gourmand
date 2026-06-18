import { createMiddleware } from 'hono/factory';

import { AuthServiceInterface } from '@/application/services/authToken/authToken.service.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';

import { CustomEnvInterface } from '../../loader/getHonoApp';

export const authenticationMiddleware = createMiddleware<CustomEnvInterface>(async (c, next) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader) {
    return next();
  }

  const [bearer, token] = authHeader.split(' ');

  if (bearer !== 'Bearer' || !token) {
    return next();
  }

  try {
    const authService = mainContainer.get<AuthServiceInterface>(TYPES.AuthService);
    const payload = await authService.verifyAccessToken(token);

    c.set('jwtPayload', payload);
    await next();
  } catch {
    return next();
  }
});
