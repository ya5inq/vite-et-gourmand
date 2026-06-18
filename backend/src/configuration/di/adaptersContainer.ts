import { ContainerModule, interfaces } from 'inversify';

import { I18nInterface } from '@/application/i18n/i18n.interface';
import { EnvConfigInterface } from '@/domain/interfaces/adapters/envConfig.interface';
import { MailSenderInterface } from '@/domain/interfaces/adapters/mailSender.interface';
import { LoggerInterface } from '@/domain/interfaces/logger/logger.interface';
import { UserRepositoryInterface } from '@/domain/interfaces/repositories/user.repository.interface';
import { UserTokenRepositoryInterface } from '@/domain/interfaces/repositories/userToken.repository.interface';

import { EnvConfig } from '@/adapters/envConfig/envConfig';
import { Logger } from '@/adapters/logger/logger';
import { MailSender } from '@/adapters/mailSender/mailSender';
import { UserRepository } from '@/adapters/repositories/userRepository/user.repository';
import { UserTokenRepository } from '@/adapters/repositories/userTokenRepository/userToken.repository';
import { i18n } from '@/application/i18n/i18n';

import { TYPES } from './types';

const adaptersContainer = new ContainerModule((bind: interfaces.Bind) => {
  // Repositories
  bind<UserRepositoryInterface>(TYPES.UserRepository).to(UserRepository);
  bind<UserTokenRepositoryInterface>(TYPES.UserTokenRepository).to(UserTokenRepository);

  // Adapters
  bind<MailSenderInterface>(TYPES.MailSender).to(MailSender);

  // Global services
  bind<LoggerInterface>(TYPES.Logger).to(Logger).inSingletonScope();
  bind<EnvConfigInterface>(TYPES.EnvConfig).to(EnvConfig).inSingletonScope();
  bind<I18nInterface>(TYPES.I18n).toConstantValue(i18n);
});

export { adaptersContainer };
