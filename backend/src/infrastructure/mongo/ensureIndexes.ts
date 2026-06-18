import { MongoClientInterface } from './mongoClient.interface';

/**
 * Creates the indexes backing the analytics and audit-log collections.
 * Idempotent — safe to run on every startup.
 */
export const ensureMongoIndexes = async (mongoClient: MongoClientInterface): Promise<void> => {
  const db = mongoClient.getDb();

  await db.collection('order_stats').createIndexes([
    { key: { menuId: 1, orderedAt: 1 }, name: 'order_stats_menu_orderedAt' },
    { key: { orderStatus: 1, completedAt: 1 }, name: 'order_stats_status_completedAt' },
    { key: { orderId: 1 }, name: 'order_stats_orderId' },
  ]);

  await db.collection('audit_logs').createIndexes([
    { key: { entityType: 1, entityId: 1 }, name: 'audit_logs_entity' },
    { key: { createdAt: -1 }, name: 'audit_logs_createdAt' },
  ]);
};
