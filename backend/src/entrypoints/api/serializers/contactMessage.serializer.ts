import { z } from 'zod';

import { ContactMessageInterface } from '@/domain/entities/contactMessage/contactMessage.entity.interface';

export const ContactMessageSchemaParser = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string(),
  phone: z.string().nullable(),
  subject: z.string().nullable(),
  message: z.string(),
  isRead: z.boolean(),
  createdAt: z.string().datetime(),
});

export type SerializedContactMessage = z.infer<typeof ContactMessageSchemaParser>;

export class ContactMessageSerializer {
  static serialize(message: ContactMessageInterface): SerializedContactMessage {
    return ContactMessageSchemaParser.parse({
      id: message.id,
      name: message.name,
      email: message.email,
      phone: message.phone,
      subject: message.subject,
      message: message.message,
      isRead: message.isRead,
      createdAt: message.createdAt.toISOString(),
    });
  }

  static serializeForList(message: ContactMessageInterface): SerializedContactMessage {
    return ContactMessageSerializer.serialize(message);
  }
}
