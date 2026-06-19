import { PageContentInterface } from '@/domain/entities/pageContent/pageContent.entity.interface';

export interface GetPageContentParamsInterface {
  page: string;
  /** When provided, returns only that section (still as a list of one). */
  section?: string;
}

export interface GetPageContentUseCaseInterface {
  executeGetPageContent: (params: GetPageContentParamsInterface) => Promise<PageContentInterface[]>;
}
