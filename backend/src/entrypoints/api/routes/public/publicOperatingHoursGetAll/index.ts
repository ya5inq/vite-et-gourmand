import { createRoute } from '@hono/zod-openapi';

import { GetAllOperatingHoursUseCaseInterface } from '@/application/useCases/cms/getAllOperatingHours/getAllOperatingHours.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { OperatingHoursSerializer } from '@/entrypoints/api/serializers/operatingHours.serializer';

import { publicOperatingHoursGetAllSchema } from './schema';

const publicOperatingHoursGetAllRoute = getHonoApp();

const route = createRoute({
  method: 'get',
  path: '/operating-hours',
  tags: ['public', 'cms'],
  operationId: 'PublicOperatingHoursGetAll',
  summary: 'CMS - List operating hours (public)',
  responses: {
    200: jsonSuccessGetResponse(publicOperatingHoursGetAllSchema.response),
  },
});

publicOperatingHoursGetAllRoute.openapi(route, async (c) => {
  const getAllOperatingHoursUseCase = mainContainer.get<GetAllOperatingHoursUseCaseInterface>(
    TYPES.GetAllOperatingHoursUseCase,
  );
  const hours = await getAllOperatingHoursUseCase.executeGetAllOperatingHours();

  return c.json({ items: hours.map((entry) => OperatingHoursSerializer.serialize(entry)) }, HttpStatuses.OK);
});

export { publicOperatingHoursGetAllRoute };
