import { ContactMessageInterface } from '@/domain/entities/contactMessage/contactMessage.entity.interface';

export interface SendContactMessageDataInterface {
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
}

export interface SendContactMessageUseCaseInterface {
  executeSendContactMessage: (data: SendContactMessageDataInterface) => Promise<ContactMessageInterface>;
}
