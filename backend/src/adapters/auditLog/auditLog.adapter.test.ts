import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getLoggerMock } from '@/adapters/logger/logger.mock';
import { getMongoClientMock } from '@/infrastructure/mongo/mongoClient.mock';

import { AuditLogRepository } from './auditLog.repository';

describe('AuditLogRepository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should insert an audit document with createdAt and null defaults', async () => {
    const insertOne = vi.fn().mockResolvedValue({ acknowledged: true });
    const mongoClient = getMongoClientMock({ getCollection: vi.fn().mockReturnValue({ insertOne }) });
    const repository = new AuditLogRepository(mongoClient, getLoggerMock());

    await repository.record({
      entityType: 'order',
      entityId: 'order-1',
      action: 'STATUS_CHANGED',
      actorId: 'user-1',
      actorRole: 'ADMIN',
    });

    expect(insertOne).toHaveBeenCalledTimes(1);
    const doc = insertOne.mock.calls[0][0] as Record<string, unknown>;
    expect(doc.entityType).toBe('order');
    expect(doc.before).toBeNull();
    expect(doc.after).toBeNull();
    expect(doc.metadata).toBeNull();
    expect(doc.createdAt).toBeInstanceOf(Date);
  });

  it('should never throw when the insert fails (fault tolerant)', async () => {
    const logger = getLoggerMock();
    const errorSpy = vi.spyOn(logger, 'error');
    const insertOne = vi.fn().mockRejectedValue(new Error('mongo down'));
    const mongoClient = getMongoClientMock({ getCollection: vi.fn().mockReturnValue({ insertOne }) });
    const repository = new AuditLogRepository(mongoClient, logger);

    await expect(
      repository.record({
        entityType: 'order',
        entityId: 'order-1',
        action: 'STATUS_CHANGED',
        actorId: null,
        actorRole: null,
      }),
    ).resolves.toBeUndefined();

    expect(errorSpy).toHaveBeenCalled();
  });
});
