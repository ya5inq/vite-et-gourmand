import { EntitySchema } from 'typeorm';

import { ContactMessageInterface } from '@/domain/entities/contactMessage/contactMessage.entity.interface';

export const ContactMessageSchema = new EntitySchema<ContactMessageInterface>({
  name: 'contactMessage',
  tableName: 'contact_messages',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    name: {
      type: 'varchar',
      length: '255',
      nullable: false,
    },
    email: {
      type: 'varchar',
      length: '255',
      nullable: false,
    },
    phone: {
      type: 'varchar',
      length: '50',
      nullable: true,
    },
    subject: {
      type: 'varchar',
      length: '255',
      nullable: true,
    },
    message: {
      type: 'text',
      nullable: false,
    },
    isRead: {
      name: 'is_read',
      type: 'boolean',
      nullable: false,
      default: false,
    },
    createdAt: {
      name: 'created_at',
      type: 'timestamp with time zone',
      createDate: true,
    },
  },
  indices: [
    {
      name: 'idx_contact_message_is_read',
      columns: ['isRead'],
    },
  ],
});
