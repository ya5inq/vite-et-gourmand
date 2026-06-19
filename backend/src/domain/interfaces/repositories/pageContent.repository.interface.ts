import { PageContentInterface } from '@/domain/entities/pageContent/pageContent.entity.interface';

export interface UpsertPageContentPayloadInterface {
  page: string;
  section: string;
  content: Record<string, unknown>;
  updatedBy: string | null;
}

export interface PageContentRepositoryInterface {
  findByPageSection: (page: string, section: string) => Promise<PageContentInterface | null>;
  findByPage: (page: string) => Promise<PageContentInterface[]>;
  findAll: () => Promise<PageContentInterface[]>;
  /** Inserts or updates the section identified by the (page, section) unique constraint. */
  upsert: (payload: UpsertPageContentPayloadInterface) => Promise<PageContentInterface>;
}
