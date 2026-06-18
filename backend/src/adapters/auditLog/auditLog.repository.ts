import { inject, injectable } from 'inversify';

import {
  AuditLogDocumentInterface,
  AuditLogQueryOptions,
  AuditLogRecordOptions,
  AuditLogRepositoryInterface,
} from '@/domain/interfaces/adapters/auditLog.repository.interface';
import { LoggerInterface } from '@/domain/interfaces/logger/logger.interface';
import { MongoClientInterface } from '@/infrastructure/mongo/mongoClient.interface';

import { TYPES } from '@/configuration/di/types';

const COLLECTION = 'audit_logs';

@injectable()
export class AuditLogRepository implements AuditLogRepositoryInterface {
  constructor(
    @inject(TYPES.MongoClient) private mongoClient: MongoClientInterface,
    @inject(TYPES.Logger) private logger: LoggerInterface,
  ) {}

  private collection() {
    return this.mongoClient.getCollection<AuditLogDocumentInterface>(COLLECTION);
  }

  async record(options: AuditLogRecordOptions): Promise<void> {
    try {
      const document: AuditLogDocumentInterface = {
        ...options,
        before: options.before ?? null,
        after: options.after ?? null,
        metadata: options.metadata ?? null,
        createdAt: new Date(),
      };
      await this.collection().insertOne(document);
    } catch (error) {
      this.logger.error('Failed to record audit log in Mongo', error, {
        entityType: options.entityType,
        entityId: options.entityId,
        action: options.action,
      });
    }
  }

  async find(query?: AuditLogQueryOptions): Promise<AuditLogDocumentInterface[]> {
    const filter: Record<string, unknown> = {};
    if (query?.entityType) {
      filter.entityType = query.entityType;
    }
    if (query?.entityId) {
      filter.entityId = query.entityId;
    }

    return this.collection()
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(query?.limit ?? 100)
      .toArray();
  }
}
