import { ContactMessageInterface } from './contactMessage.entity.interface';

export class ContactMessage implements ContactMessageInterface {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public phone: string | null,
    public subject: string | null,
    public message: string,
    public isRead: boolean,
    public createdAt: Date,
  ) {}
}
