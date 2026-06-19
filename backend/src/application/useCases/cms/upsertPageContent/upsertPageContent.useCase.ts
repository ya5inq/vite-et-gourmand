import { inject, injectable } from 'inversify';

import { PageContentInterface } from '@/domain/entities/pageContent/pageContent.entity.interface';
import { PageContentRepositoryInterface } from '@/domain/interfaces/repositories/pageContent.repository.interface';

import { TYPES } from '@/configuration/di/types';

import {
  UpsertPageContentDataInterface,
  UpsertPageContentUseCaseInterface,
} from './upsertPageContent.useCase.interface';

@injectable()
export class UpsertPageContentUseCase implements UpsertPageContentUseCaseInterface {
  constructor(@inject(TYPES.PageContentRepository) private pageContentRepository: PageContentRepositoryInterface) {}

  async executeUpsertPageContent(data: UpsertPageContentDataInterface): Promise<PageContentInterface> {
    return this.pageContentRepository.upsert({
      page: data.page,
      section: data.section,
      content: data.content,
      updatedBy: data.updatedBy,
    });
  }
}
