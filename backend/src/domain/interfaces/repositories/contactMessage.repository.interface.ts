import { ContactMessageInterface } from '@/domain/entities/contactMessage/contactMessage.entity.interface';

export type SortOrder = 'ASC' | 'DESC';
export type ContactMessageSortBy = 'createdAt';

export interface FindAllContactMessagesParamsInterface {
  isRead?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: ContactMessageSortBy;
  sortOrder?: SortOrder;
}

export interface ContactMessageRepositoryInterface {
  findById: (id: string) => Promise<ContactMessageInterface | null>;
  findAll: (params?: FindAllContactMessagesParamsInterface) => Promise<ContactMessageInterface[]>;
  countFindAll: (params?: FindAllContactMessagesParamsInterface) => Promise<number>;
  create: (message: ContactMessageInterface) => Promise<ContactMessageInterface>;
  updateOne: (id: string, data: Partial<ContactMessageInterface>) => Promise<void>;
  deleteOne: (id: string) => Promise<void>;
}
