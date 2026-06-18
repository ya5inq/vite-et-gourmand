import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';

import { authLoginRoute } from './authLogin';
import { authLogoutRoute } from './authLogout';
import { authRefreshRoute } from './authRefresh';
import { authRegisterRoute } from './authRegister';
import { authResendValidationRoute } from './authResendValidation';
import { authResetPasswordRoute } from './authResetPassword';
import { authResetPasswordRequestRoute } from './authResetPasswordRequest';
import { authValidateAccountRoute } from './authValidateAccount';
import { healthcheckRoute } from './healthcheck';

const publicRouter = getHonoApp();

publicRouter
  // Auth routes
  .route('/auth', authLoginRoute)
  .route('/auth', authRegisterRoute)
  .route('/auth', authRefreshRoute)
  .route('/auth', authLogoutRoute)
  .route('/auth', authResetPasswordRequestRoute)
  .route('/auth', authResetPasswordRoute)
  .route('/auth', authValidateAccountRoute)
  .route('/auth', authResendValidationRoute)

  // Healthcheck routes
  .route('/healthcheck', healthcheckRoute);

export { publicRouter };
