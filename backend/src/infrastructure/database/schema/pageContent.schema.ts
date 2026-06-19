import { EntitySchema } from 'typeorm';

import { PageContentInterface } from '@/domain/entities/pageContent/pageContent.entity.interface';

export const PageContentSchema = new EntitySchema<PageContentInterface>({
  name: 'pageContent',
  tableName: 'page_contents',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    page: {
      type: 'text',
      nullable: false,
    },
    section: {
      type: 'text',
      nullable: false,
    },
    content: {
      type: 'jsonb',
      nullable: false,
      default: {},
    },
    updatedAt: {
      name: 'updated_at',
      type: 'timestamp with time zone',
      updateDate: true,
    },
    updatedBy: {
      name: 'updated_by',
      type: 'uuid',
      nullable: true,
    },
  },
  uniques: [
    {
      name: 'uq_page_content_page_section',
      columns: ['page', 'section'],
    },
  ],
});
