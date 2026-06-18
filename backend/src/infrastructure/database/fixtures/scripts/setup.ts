/* eslint-disable no-console */

/**
 * Fixtures Setup Script
 *
 * ℹ️ NOTE: This script uses console.log instead of Logger.
 *
 * Reason: This is a standalone CLI script executed with `pnpm fixtures:load`
 * without the full application HTTP/DI lifecycle. console.log is acceptable here.
 *
 * Phase 0 (scaffold): there are no fixtures to load yet. This script simply
 * connects to the database to validate the setup, then disconnects.
 */

import 'reflect-metadata';
import 'dotenv/config';

import { EnvConfigInterface } from '@/domain/interfaces/adapters/envConfig.interface';
import { ClientDatabaseInterface } from '@/infrastructure/database/clientDatabase/clientDatabase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';

const setupFixtures = async (): Promise<void> => {
  console.log('🚀 Starting fixtures setup...');

  let clientDatabase: ClientDatabaseInterface | undefined = undefined;

  try {
    const envConfig = mainContainer.get<EnvConfigInterface>(TYPES.EnvConfig);
    clientDatabase = mainContainer.get<ClientDatabaseInterface>(TYPES.ClientDatabase);

    await clientDatabase.connect(envConfig.dbUrl);

    console.log('ℹ️  No fixtures defined yet (Phase 0 scaffold). Nothing to load.');

    console.log('✅ Fixtures setup completed.');
  } catch (error) {
    console.error('❌ Error during fixtures setup', error);
    process.exitCode = 1;
  } finally {
    if (clientDatabase) {
      await clientDatabase.disconnect().catch(() => undefined);
    }
  }
};

void setupFixtures();
