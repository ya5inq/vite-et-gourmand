import { createRoute } from '@hono/zod-openapi';

import { GetPageContentUseCaseInterface } from '@/application/useCases/cms/getPageContent/getPageContent.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { PageContentSerializer } from '@/entrypoints/api/serializers/pageContent.serializer';

import { publicPageContentGetSchema } from './schema';

const publicPageContentGetRoute = getHonoApp();

const route = createRoute({
  method: 'get',
  path: '/page-content',
  request: {
    query: publicPageContentGetSchema.query,
  },
  tags: ['public', 'cms'],
  operationId: 'PublicPageContentGet',
  summary: 'CMS - Get page content (public)',
  responses: {
    200: jsonSuccessGetResponse(publicPageContentGetSchema.response),
  },
});

publicPageContentGetRoute.openapi(route, async (c) => {
  const { page, section } = c.req.valid('query');

  const getPageContentUseCase = mainContainer.get<GetPageContentUseCaseInterface>(TYPES.GetPageContentUseCase);
  const contents = await getPageContentUseCase.executeGetPageContent({ page, section });

  return c.json({ items: contents.map((content) => PageContentSerializer.serialize(content)) }, HttpStatuses.OK);
});

export { publicPageContentGetRoute };
