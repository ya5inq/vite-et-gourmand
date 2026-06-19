import { vi, type Mocked } from 'vitest';

import { MailSenderInterface } from '@/domain/interfaces/adapters/mailSender.interface';

export const getMailSenderMock = (): Mocked<MailSenderInterface> => ({
  sendRegisterEmail: vi.fn(),
  sendResetPasswordEmail: vi.fn(),
  sendEmployeeSetPasswordEmail: vi.fn(),
  sendOrderConfirmationEmail: vi.fn(),
});
