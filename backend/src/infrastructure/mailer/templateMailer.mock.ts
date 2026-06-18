import { Mocked, vi } from 'vitest';

import { TemplateMailerInterface } from './templateMailer.interface';

export const getTemplateMailerMock = (): Mocked<TemplateMailerInterface> => ({
  sendTemplateEmail: vi.fn().mockResolvedValue(undefined),
});
