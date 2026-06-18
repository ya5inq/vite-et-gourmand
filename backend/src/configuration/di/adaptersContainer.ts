import { ContainerModule, interfaces } from 'inversify';

import { I18nInterface } from '@/application/i18n/i18n.interface';
import { EnvConfigInterface } from '@/domain/interfaces/adapters/envConfig.interface';
import { LoggerInterface } from '@/domain/interfaces/logger/logger.interface';

import { EnvConfig } from '@/adapters/envConfig/envConfig';
import { Logger } from '@/adapters/logger/logger';
import { i18n } from '@/application/i18n/i18n';

import { TYPES } from './types';

const adaptersContainer = new ContainerModule((bind: interfaces.Bind) => {
  // Global services
  bind<LoggerInterface>(TYPES.Logger).to(Logger).inSingletonScope();
  bind<EnvConfigInterface>(TYPES.EnvConfig).to(EnvConfig).inSingletonScope();
  bind<I18nInterface>(TYPES.I18n).toConstantValue(i18n);
});

export { adaptersContainer };
