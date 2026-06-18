import { publicRouter } from './public/public.router';
import { getHonoApp } from '../loader/getHonoApp';

const routes = getHonoApp();

routes.route('/public', publicRouter);

export { routes };
