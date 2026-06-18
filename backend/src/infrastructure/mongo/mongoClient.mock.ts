import { vi } from 'vitest';

import { MongoClientInterface } from './mongoClient.interface';

/**
 * Test double for the Mongo client. `getCollection`/`getDb` are generic in the
 * real interface, so they are provided as plain vi.fn() and the whole object is
 * cast — tests configure the return value they need per case.
 */
export const getMongoClientMock = (
  overrides: Partial<Record<keyof MongoClientInterface, unknown>> = {},
): MongoClientInterface =>
  ({
    connect: vi.fn(),
    disconnect: vi.fn(),
    getDb: vi.fn(),
    getCollection: vi.fn(),
    isConnected: vi.fn().mockReturnValue(true),
    ...overrides,
  }) as unknown as MongoClientInterface;
