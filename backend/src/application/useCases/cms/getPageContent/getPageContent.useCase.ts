import { inject, injectable } from 'inversify';

import { PageContentInterface } from '@/domain/entities/pageContent/pageContent.entity.interface';
import { PageContentRepositoryInterface } from '@/domain/interfaces/repositories/pageContent.repository.interface';

import { TYPES } from '@/configuration/di/types';

import { GetPageContentParamsInterface, GetPageContentUseCaseInterface } from './getPageContent.useCase.interface';

@injectable()
export class GetPageContentUseCase implements GetPageContentUseCaseInterface {
  constructor(@inject(TYPES.PageContentRepository) private pageContentRepository: PageContentRepositoryInterface) {}

  async executeGetPageContent({ page, section }: GetPageContentParamsInterface): Promise<PageContentInterface[]> {
    if (section) {
      const found = await this.pageContentRepository.findByPageSection(page, section);
      return found ? [found] : [];
    }

    return this.pageContentRepository.findByPage(page);
  }
}
