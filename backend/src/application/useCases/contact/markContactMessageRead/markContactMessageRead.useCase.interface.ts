import { ContactMessageInterface } from '@/domain/entities/contactMessage/contactMessage.entity.interface';

export interface MarkContactMessageReadParamsInterface {
  messageId: string;
}

export interface MarkContactMessageReadUseCaseInterface {
  executeMarkContactMessageRead: (params: MarkContactMessageReadParamsInterface) => Promise<ContactMessageInterface>;
}
