import { PageContentInterface } from '@/domain/entities/pageContent/pageContent.entity.interface';

export interface UpsertPageContentDataInterface {
  page: string;
  section: string;
  content: Record<string, unknown>;
  updatedBy: string | null;
}

export interface UpsertPageContentUseCaseInterface {
  executeUpsertPageContent: (data: UpsertPageContentDataInterface) => Promise<PageContentInterface>;
}
