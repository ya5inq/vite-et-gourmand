import { createMiddleware } from 'hono/factory';

import { GetUserUseCaseInterface } from '@/application/useCases/user/getUser/getUser.useCase.interface';
import { isStaffRole } from '@/domain/entities/user/user.entity.interface';

import { AppError } from '@/application/errors/app.error';
import { AppErrorCodes } from '@/application/errors/app.error.codes';
import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';

import { CustomEnvInterface } from '../../loader/getHonoApp';

interface AuthorizationOptions {
  shouldBeAdmin?: boolean;
  shouldBeStaff?: boolean;
  optional?: boolean;
}

export const authorizationMiddleware = ({ shouldBeAdmin, shouldBeStaff, optional }: AuthorizationOptions = {}) => {
  return createMiddleware<CustomEnvInterface>(async (c, next) => {
    // Request-scoped translator from context (set by acceptLanguage middleware)
    const translator = c.get('translator');

    const jwtPayload = c.get('jwtPayload');
    if (!jwtPayload) {
      if (optional) {
        c.set('currentUser', undefined);
        await next();
        return;
      }
      throw new AppError({
        code: AppErrorCodes.UNAUTHORIZED,
        message: translator?.t(`errors.${AppErrorCodes.UNAUTHORIZED}`) ?? AppErrorCodes.UNAUTHORIZED,
      });
    }

    const getUserUseCase = mainContainer.get<GetUserUseCaseInterface>(TYPES.GetUserUseCase);
    const user = await getUserUseCase.executeGetUser({ userId: jwtPayload.userId });

    if (!user) {
      if (optional) {
        c.set('currentUser', undefined);
        await next();
        return;
      }
      throw new AppError({
        code: AppErrorCodes.UNAUTHORIZED_CURRENT_USER_NOT_FOUND,
        message:
          translator?.t(`errors.${AppErrorCodes.UNAUTHORIZED_CURRENT_USER_NOT_FOUND}`) ??
          AppErrorCodes.UNAUTHORIZED_CURRENT_USER_NOT_FOUND,
      });
    }

    // A disabled account cannot access protected resources.
    if (!user.isActive && !optional) {
      throw new AppError({
        code: AppErrorCodes.UNAUTHORIZED_ACCOUNT_DISABLED,
        message:
          translator?.t(`errors.${AppErrorCodes.UNAUTHORIZED_ACCOUNT_DISABLED}`) ??
          AppErrorCodes.UNAUTHORIZED_ACCOUNT_DISABLED,
      });
    }

    if (shouldBeAdmin && !user.admin && !optional) {
      throw new AppError({
        code: AppErrorCodes.FORBIDDEN,
        message: translator?.t(`errors.${AppErrorCodes.FORBIDDEN}`) ?? AppErrorCodes.FORBIDDEN,
      });
    }

    if (shouldBeStaff && !isStaffRole(user.role) && !optional) {
      throw new AppError({
        code: AppErrorCodes.FORBIDDEN,
        message: translator?.t(`errors.${AppErrorCodes.FORBIDDEN}`) ?? AppErrorCodes.FORBIDDEN,
      });
    }

    c.set('currentUser', user);

    await next();
  });
};
