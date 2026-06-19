import { createRoute } from '@hono/zod-openapi';

import { GetPageContentUseCaseInterface } from '@/application/useCases/cms/getPageContent/getPageContent.useCase.interface';
import { PageContentRepositoryInterface } from '@/domain/interfaces/repositories/pageContent.repository.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse, jsonErrorResponse, AppErrorCodes } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { PageContentSerializer } from '@/entrypoints/api/serializers/pageContent.serializer';

import { adminPageContentGetAllSchema } from './schema';

const adminPageContentGetAllRoute = getHonoApp();

const route = createRoute({
  method: 'get',
  path: '/page-content',
  request: {
    query: adminPageContentGetAllSchema.query,
  },
  tags: ['admin', 'cms'],
  operationId: 'AdminPageContentGetAll',
  summary: 'CMS - List page content (staff)',
  responses: {
    200: jsonSuccessGetResponse(adminPageContentGetAllSchema.response),
    401: jsonErrorResponse(AppErrorCodes.UNAUTHORIZED),
    403: jsonErrorResponse(AppErrorCodes.FORBIDDEN),
  },
});

adminPageContentGetAllRoute.openapi(route, async (c) => {
  const { page } = c.req.valid('query');

  if (page) {
    const getPageContentUseCase = mainContainer.get<GetPageContentUseCaseInterface>(TYPES.GetPageContentUseCase);
    const contents = await getPageContentUseCase.executeGetPageContent({ page });
    return c.json({ items: contents.map((content) => PageContentSerializer.serialize(content)) }, HttpStatuses.OK);
  }

  const pageContentRepository = mainContainer.get<PageContentRepositoryInterface>(TYPES.PageContentRepository);
  const contents = await pageContentRepository.findAll();

  return c.json({ items: contents.map((content) => PageContentSerializer.serialize(content)) }, HttpStatuses.OK);
});

export { adminPageContentGetAllRoute };
