import { ContainerModule, interfaces } from 'inversify';

import { I18nInterface } from '@/application/i18n/i18n.interface';
import { AnalyticsRepositoryInterface } from '@/domain/interfaces/adapters/analytics.repository.interface';
import { AuditLogRepositoryInterface } from '@/domain/interfaces/adapters/auditLog.repository.interface';
import { EnvConfigInterface } from '@/domain/interfaces/adapters/envConfig.interface';
import { MailSenderInterface } from '@/domain/interfaces/adapters/mailSender.interface';
import { QueueManagerInterface } from '@/domain/interfaces/adapters/queueManager.interface';
import { LoggerInterface } from '@/domain/interfaces/logger/logger.interface';
import { AllergenRepositoryInterface } from '@/domain/interfaces/repositories/allergen.repository.interface';
import { DeliveryZoneRepositoryInterface } from '@/domain/interfaces/repositories/deliveryZone.repository.interface';
import { DietaryRegimeRepositoryInterface } from '@/domain/interfaces/repositories/dietaryRegime.repository.interface';
import { DishRepositoryInterface } from '@/domain/interfaces/repositories/dish.repository.interface';
import { MenuRepositoryInterface } from '@/domain/interfaces/repositories/menu.repository.interface';
import { OrderRepositoryInterface } from '@/domain/interfaces/repositories/order.repository.interface';
import { UserRepositoryInterface } from '@/domain/interfaces/repositories/user.repository.interface';
import { UserTokenRepositoryInterface } from '@/domain/interfaces/repositories/userToken.repository.interface';

import { AnalyticsRepository } from '@/adapters/analytics/analytics.repository';
import { AuditLogRepository } from '@/adapters/auditLog/auditLog.repository';
import { EnvConfig } from '@/adapters/envConfig/envConfig';
import { Logger } from '@/adapters/logger/logger';
import { MailSender } from '@/adapters/mailSender/mailSender';
import { QueueManager } from '@/adapters/queueManager/queueManager';
import { AllergenRepository } from '@/adapters/repositories/allergenRepository/allergen.repository';
import { DeliveryZoneRepository } from '@/adapters/repositories/deliveryZoneRepository/deliveryZone.repository';
import { DietaryRegimeRepository } from '@/adapters/repositories/dietaryRegimeRepository/dietaryRegime.repository';
import { DishRepository } from '@/adapters/repositories/dishRepository/dish.repository';
import { MenuRepository } from '@/adapters/repositories/menuRepository/menu.repository';
import { OrderRepository } from '@/adapters/repositories/orderRepository/order.repository';
import { UserRepository } from '@/adapters/repositories/userRepository/user.repository';
import { UserTokenRepository } from '@/adapters/repositories/userTokenRepository/userToken.repository';
import { i18n } from '@/application/i18n/i18n';

import { TYPES } from './types';

const adaptersContainer = new ContainerModule((bind: interfaces.Bind) => {
  // Repositories
  bind<UserRepositoryInterface>(TYPES.UserRepository).to(UserRepository);
  bind<UserTokenRepositoryInterface>(TYPES.UserTokenRepository).to(UserTokenRepository);
  bind<AllergenRepositoryInterface>(TYPES.AllergenRepository).to(AllergenRepository);
  bind<DietaryRegimeRepositoryInterface>(TYPES.DietaryRegimeRepository).to(DietaryRegimeRepository);
  bind<DishRepositoryInterface>(TYPES.DishRepository).to(DishRepository);
  bind<MenuRepositoryInterface>(TYPES.MenuRepository).to(MenuRepository);
  bind<DeliveryZoneRepositoryInterface>(TYPES.DeliveryZoneRepository).to(DeliveryZoneRepository);
  bind<OrderRepositoryInterface>(TYPES.OrderRepository).to(OrderRepository);

  // Adapters
  bind<MailSenderInterface>(TYPES.MailSender).to(MailSender);
  bind<AnalyticsRepositoryInterface>(TYPES.AnalyticsRepository).to(AnalyticsRepository);
  bind<AuditLogRepositoryInterface>(TYPES.AuditLogRepository).to(AuditLogRepository);
  bind<QueueManagerInterface>(TYPES.QueueManager).to(QueueManager).inSingletonScope();

  // Global services
  bind<LoggerInterface>(TYPES.Logger).to(Logger).inSingletonScope();
  bind<EnvConfigInterface>(TYPES.EnvConfig).to(EnvConfig).inSingletonScope();
  bind<I18nInterface>(TYPES.I18n).toConstantValue(i18n);
});

export { adaptersContainer };
