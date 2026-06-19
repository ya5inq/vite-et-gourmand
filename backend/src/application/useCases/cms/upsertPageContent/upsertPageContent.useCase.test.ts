import { describe, beforeEach, vi, expect, it } from 'vitest';

import { getPageContentRepositoryMock } from '@/adapters/repositories/pageContentRepository/pageContent.repository.mock';
import { pageContentFactory } from '@/domain/entities/pageContent/pageContent.factory';

import { UpsertPageContentUseCase } from './upsertPageContent.useCase';

describe('UpsertPageContentUseCase', () => {
  const pageContentRepositoryMock = getPageContentRepositoryMock();
  const useCase = new UpsertPageContentUseCase(pageContentRepositoryMock);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('upserts the page section with the new content', async () => {
    const expected = pageContentFactory({ page: 'home', section: 'hero', content: { title: 'New' } });
    pageContentRepositoryMock.upsert.mockResolvedValue(expected);

    const result = await useCase.executeUpsertPageContent({
      page: 'home',
      section: 'hero',
      content: { title: 'New' },
      updatedBy: 'staff-1',
    });

    expect(pageContentRepositoryMock.upsert).toHaveBeenCalledWith({
      page: 'home',
      section: 'hero',
      content: { title: 'New' },
      updatedBy: 'staff-1',
    });
    expect(result).toEqual(expected);
  });
});
