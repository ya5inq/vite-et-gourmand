import { vi, type Mocked } from 'vitest';

import { AuditLogRepositoryInterface } from '@/domain/interfaces/adapters/auditLog.repository.interface';

export const getAuditLogRepositoryMock = (
  overrides: Partial<Mocked<AuditLogRepositoryInterface>> = {},
): Mocked<AuditLogRepositoryInterface> => ({
  record: vi.fn(),
  find: vi.fn().mockResolvedValue([]),
  ...overrides,
});
