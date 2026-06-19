import { adminRouter } from './admin/admin.router';
import { adminRestrictedRouter } from './admin/adminRestricted.router';
import { protectedRouter } from './protected/protected.router';
import { publicRouter } from './public/public.router';
import { getHonoApp } from '../loader/getHonoApp';

const routes = getHonoApp();

routes
  .route('/public', publicRouter)
  .route('/protected', protectedRouter)
  // Admin-only routes (employees, stats…) are mounted before the staff catalogue
  // routes so their stricter authorization middleware applies first.
  .route('/admin', adminRestrictedRouter)
  .route('/admin', adminRouter);

export { routes };
