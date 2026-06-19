export interface ContactMessageInterface {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  /** True once a staff member has read the message. */
  isRead: boolean;
  createdAt: Date;
}
