import { z } from 'zod';

import { PageContentInterface } from '@/domain/entities/pageContent/pageContent.entity.interface';

export const PageContentSchemaParser = z.object({
  id: z.string().uuid(),
  page: z.string(),
  section: z.string(),
  content: z.record(z.unknown()),
  updatedAt: z.string().datetime(),
  updatedBy: z.string().uuid().nullable(),
});

export type SerializedPageContent = z.infer<typeof PageContentSchemaParser>;

export class PageContentSerializer {
  static serialize(pageContent: PageContentInterface): SerializedPageContent {
    return PageContentSchemaParser.parse({
      id: pageContent.id,
      page: pageContent.page,
      section: pageContent.section,
      content: pageContent.content,
      updatedAt: pageContent.updatedAt.toISOString(),
      updatedBy: pageContent.updatedBy,
    });
  }

  static serializeForList(pageContent: PageContentInterface): SerializedPageContent {
    return PageContentSerializer.serialize(pageContent);
  }
}
