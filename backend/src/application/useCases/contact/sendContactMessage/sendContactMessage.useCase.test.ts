import { describe, beforeEach, vi, expect, it } from 'vitest';

import { getLoggerMock } from '@/adapters/logger/logger.mock';
import { getMailSenderMock } from '@/adapters/mailSender/mailSender.mock';
import { getContactMessageRepositoryMock } from '@/adapters/repositories/contactMessageRepository/contactMessage.repository.mock';

import { SendContactMessageUseCase } from './sendContactMessage.useCase';

describe('SendContactMessageUseCase', () => {
  const contactMessageRepositoryMock = getContactMessageRepositoryMock();
  const mailSenderMock = getMailSenderMock();
  const loggerMock = getLoggerMock();
  const useCase = new SendContactMessageUseCase(contactMessageRepositoryMock, mailSenderMock, loggerMock);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('persists the message and sends the contact email', async () => {
    contactMessageRepositoryMock.create.mockImplementation((m) => Promise.resolve({ ...m, id: 'msg-1' }));

    const result = await useCase.executeSendContactMessage({
      name: 'Jean',
      email: 'jean@example.com',
      phone: '0600000000',
      subject: 'Devis',
      message: 'Bonjour',
    });

    const persisted = contactMessageRepositoryMock.create.mock.calls[0][0];
    expect(persisted.name).toBe('Jean');
    expect(persisted.isRead).toBe(false);
    expect(mailSenderMock.sendContactEmail).toHaveBeenCalledWith(
      expect.objectContaining({ fromName: 'Jean', fromEmail: 'jean@example.com', message: 'Bonjour' }),
    );
    expect(result.id).toBe('msg-1');
  });

  it('still returns the persisted message when the email fails', async () => {
    contactMessageRepositoryMock.create.mockImplementation((m) => Promise.resolve({ ...m, id: 'msg-2' }));
    mailSenderMock.sendContactEmail.mockRejectedValueOnce(new Error('mail down'));

    const result = await useCase.executeSendContactMessage({
      name: 'Marie',
      email: 'marie@example.com',
      message: 'Question',
    });

    expect(result.id).toBe('msg-2');
    expect(loggerMock.error).toHaveBeenCalled();
  });
});
