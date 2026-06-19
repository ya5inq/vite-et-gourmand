import { inject, injectable } from 'inversify';
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { PageContentInterface } from '@/domain/entities/pageContent/pageContent.entity.interface';
import {
  PageContentRepositoryInterface,
  UpsertPageContentPayloadInterface,
} from '@/domain/interfaces/repositories/pageContent.repository.interface';
import { ClientDatabaseInterface } from '@/infrastructure/database/clientDatabase/clientDatabase.interface';

import { TYPES } from '@/configuration/di/types';
import { PageContentSchema } from '@/infrastructure/database/schema/pageContent.schema';

@injectable()
export class PageContentRepository implements PageContentRepositoryInterface {
  private repository: Repository<PageContentInterface>;
  constructor(@inject(TYPES.ClientDatabase) clientDatabase: ClientDatabaseInterface) {
    this.repository = clientDatabase.getDataSource().getRepository(PageContentSchema);
  }

  async findByPageSection(page: string, section: string): Promise<PageContentInterface | null> {
    return this.repository.findOne({ where: { page, section } });
  }

  async findByPage(page: string): Promise<PageContentInterface[]> {
    return this.repository.find({ where: { page }, order: { section: 'ASC' } });
  }

  async findAll(): Promise<PageContentInterface[]> {
    return this.repository.find({ order: { page: 'ASC', section: 'ASC' } });
  }

  async upsert(payload: UpsertPageContentPayloadInterface): Promise<PageContentInterface> {
    const { page, section, content, updatedBy } = payload;

    const values = {
      page,
      section,
      content,
      updatedBy,
      updatedAt: new Date(),
    } as unknown as QueryDeepPartialEntity<PageContentInterface>;

    await this.repository
      .createQueryBuilder()
      .insert()
      .into(PageContentSchema)
      .values(values)
      .orUpdate(['content', 'updated_by', 'updated_at'], ['page', 'section'])
      .execute();

    const upserted = await this.findByPageSection(page, section);
    if (!upserted) {
      throw new Error(`Failed to upsert page content for ${page}/${section}`);
    }
    return upserted;
  }
}
