import 'dotenv/config';
import 'reflect-metadata';

import { EnvConfigInterface } from '@/domain/interfaces/adapters/envConfig.interface';
import { LoggerInterface } from '@/domain/interfaces/logger/logger.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';

import { ClientDatabase } from './clientDatabase/clientDatabase';

const envConfig = mainContainer.get<EnvConfigInterface>(TYPES.EnvConfig);
const logger = mainContainer.get<LoggerInterface>(TYPES.Logger);
const clientDatabase = new ClientDatabase(envConfig, logger);

void clientDatabase.connect(envConfig.dbUrl);

export default clientDatabase.getDataSource();
