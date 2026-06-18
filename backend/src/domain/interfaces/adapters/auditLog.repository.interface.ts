/**
 * Audit log repository — backed by MongoDB (NoSQL).
 *
 * Append-only record of significant events (order transitions, employee
 * creation/deactivation, review moderation). Used for traceability.
 */

export interface AuditLogRecordOptions {
  entityType: string;
  entityId: string;
  action: string;
  actorId: string | null;
  actorRole: string | null;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
  metadata?: Record<string, unknown> | null;
}

export interface AuditLogDocumentInterface extends AuditLogRecordOptions {
  createdAt: Date;
}

export interface AuditLogQueryOptions {
  entityType?: string;
  entityId?: string;
  limit?: number;
}

export interface AuditLogRepositoryInterface {
  /**
   * Appends an audit entry. Must never throw on infrastructure failure —
   * failures are logged by the implementation.
   */
  record(options: AuditLogRecordOptions): Promise<void>;
  find(query?: AuditLogQueryOptions): Promise<AuditLogDocumentInterface[]>;
}
