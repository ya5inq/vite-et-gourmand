import { ContainerModule, interfaces } from 'inversify';

import { ClientDatabaseInterface } from '@/infrastructure/database/clientDatabase/clientDatabase.interface';

import { ClientDatabase } from '@/infrastructure/database/clientDatabase/clientDatabase';

import { TYPES } from './types';

const infraContainer = new ContainerModule((bind: interfaces.Bind) => {
  bind<ClientDatabaseInterface>(TYPES.ClientDatabase).to(ClientDatabase).inSingletonScope();
});

export { infraContainer };
