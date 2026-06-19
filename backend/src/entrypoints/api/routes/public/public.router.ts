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
import { publicAllergenGetAllRoute } from './publicAllergenGetAll';
import { publicDietaryRegimeGetAllRoute } from './publicDietaryRegimeGetAll';
import { publicMenuGetAllRoute } from './publicMenuGetAll';
import { publicMenuGetOneRoute } from './publicMenuGetOne';

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

  // Catalog (public, used by the storefront + filters)
  .route('/', publicMenuGetAllRoute)
  .route('/', publicMenuGetOneRoute)
  .route('/', publicAllergenGetAllRoute)
  .route('/', publicDietaryRegimeGetAllRoute)

  // Healthcheck routes
  .route('/healthcheck', healthcheckRoute);

export { publicRouter };
