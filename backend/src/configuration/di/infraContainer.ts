import { ContainerModule, interfaces } from 'inversify';

import { EnvConfigInterface } from '@/domain/interfaces/adapters/envConfig.interface';
import { LoggerInterface } from '@/domain/interfaces/logger/logger.interface';
import { ClientDatabaseInterface } from '@/infrastructure/database/clientDatabase/clientDatabase.interface';
import { TemplateMailerInterface } from '@/infrastructure/mailer/templateMailer.interface';

import { ClientDatabase } from '@/infrastructure/database/clientDatabase/clientDatabase';
import { ResendTemplateMailer } from '@/infrastructure/mailer/providers/resend/resendTemplateMailer';

import { TYPES } from './types';

const infraContainer = new ContainerModule((bind: interfaces.Bind) => {
  bind<ClientDatabaseInterface>(TYPES.ClientDatabase).to(ClientDatabase).inSingletonScope();

  // TemplateMailer - Resend. In dev (no API key or non-production) emails are
  // logged instead of being sent over the network.
  bind<TemplateMailerInterface>(TYPES.TemplateMailer)
    .toDynamicValue((context: interfaces.Context) => {
      const envConfig = context.container.get<EnvConfigInterface>(TYPES.EnvConfig);
      const logger = context.container.get<LoggerInterface>(TYPES.Logger);

      const emailSend = envConfig.nodeEnv === 'production' && Boolean(envConfig.resendApiKey);

      return new ResendTemplateMailer(
        {
          apiKey: envConfig.resendApiKey,
          fromEmail: envConfig.fromEmail,
          emailSend,
        },
        logger,
      );
    })
    .inSingletonScope();
});

export { infraContainer };
