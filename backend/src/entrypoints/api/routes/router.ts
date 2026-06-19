import { adminRouter } from './admin/admin.router';
import { protectedRouter } from './protected/protected.router';
import { publicRouter } from './public/public.router';
import { getHonoApp } from '../loader/getHonoApp';

const routes = getHonoApp();

routes.route('/public', publicRouter).route('/protected', protectedRouter).route('/admin', adminRouter);

export { routes };
