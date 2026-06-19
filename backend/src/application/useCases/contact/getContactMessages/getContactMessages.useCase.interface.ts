import { ContactMessageInterface } from '@/domain/entities/contactMessage/contactMessage.entity.interface';
import { FindAllContactMessagesParamsInterface } from '@/domain/interfaces/repositories/contactMessage.repository.interface';

export type GetContactMessagesParamsInterface = FindAllContactMessagesParamsInterface;

export interface GetContactMessagesResultInterface {
  items: ContactMessageInterface[];
  totalCount: number;
}

export interface GetContactMessagesUseCaseInterface {
  executeGetContactMessages: (params: GetContactMessagesParamsInterface) => Promise<GetContactMessagesResultInterface>;
}
