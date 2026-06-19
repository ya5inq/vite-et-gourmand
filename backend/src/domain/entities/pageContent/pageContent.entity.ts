import { PageContentInterface } from './pageContent.entity.interface';

export class PageContent implements PageContentInterface {
  constructor(
    public id: string,
    public page: string,
    public section: string,
    public content: Record<string, unknown>,
    public updatedAt: Date,
    public updatedBy: string | null = null,
  ) {}
}
