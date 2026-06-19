/* eslint-disable no-console */

/**
 * Fixtures Setup Script (Phase 3 - Catalogue)
 *
 * ℹ️ NOTE: This script uses console.log instead of Logger.
 * Reason: standalone CLI script executed with `pnpm fixtures:load` without the
 * full HTTP/DI lifecycle. console.log is acceptable here.
 *
 * Strategy: programmatic, idempotent load via the TypeORM DataSource.
 *  - TRUNCATE catalog tables (+ join tables) with CASCADE.
 *  - Insert 14 allergens, 7 dietary regimes, 26 dishes (+ allergen relations),
 *    8 menus (+ dish & dietary-regime relations).
 *  - Upsert an ADMIN user (admin@viteetgourmand.fr / password123) for smoke tests.
 *
 * Other phases' data (delivery_zones / operating_hours / page_contents) are NOT
 * ported here.
 */

import 'reflect-metadata';
import 'dotenv/config';

import { v4 as uuidv4 } from 'uuid';

import { PasswordServiceInterface } from '@/application/services/password/password.service.interface';
import { AllergenInterface } from '@/domain/entities/allergen/allergen.entity.interface';
import { DietaryRegimeInterface } from '@/domain/entities/dietaryRegime/dietaryRegime.entity.interface';
import { DishInterface } from '@/domain/entities/dish/dish.entity.interface';
import { RoleType, UserInterface } from '@/domain/entities/user/user.entity.interface';
import { EnvConfigInterface } from '@/domain/interfaces/adapters/envConfig.interface';
import { ClientDatabaseInterface } from '@/infrastructure/database/clientDatabase/clientDatabase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { AllergenSchema } from '@/infrastructure/database/schema/allergen.schema';
import { DietaryRegimeSchema } from '@/infrastructure/database/schema/dietaryRegime.schema';
import { DishSchema } from '@/infrastructure/database/schema/dish.schema';
import { MenuSchema } from '@/infrastructure/database/schema/menu.schema';
import { UserSchema } from '@/infrastructure/database/schema/user.schema';

import { ALLERGENS, DIETARY_REGIMES, DISHES, MENUS } from '../data/catalog.data';

const ADMIN_EMAIL = 'admin@viteetgourmand.fr';
const ADMIN_PASSWORD = 'password123';

const setupFixtures = async (): Promise<void> => {
  console.log('🚀 Starting catalog fixtures setup...');

  let clientDatabase: ClientDatabaseInterface | undefined = undefined;

  try {
    const envConfig = mainContainer.get<EnvConfigInterface>(TYPES.EnvConfig);
    const passwordService = mainContainer.get<PasswordServiceInterface>(TYPES.PasswordService);
    clientDatabase = mainContainer.get<ClientDatabaseInterface>(TYPES.ClientDatabase);

    await clientDatabase.connect(envConfig.dbUrl);
    const dataSource = clientDatabase.getDataSource();

    // 1. Clean catalog tables (reverse dependency order, CASCADE clears join tables).
    await dataSource.query(
      'TRUNCATE "menu_dietary_regimes", "menu_dishes", "dish_allergens", "menus", "dishes", "dietary_regimes", "allergens" RESTART IDENTITY CASCADE',
    );

    // 2. Allergens
    const allergenRepository = dataSource.getRepository(AllergenSchema);
    const allergensByName = new Map<string, AllergenInterface>();
    for (const fixture of ALLERGENS) {
      const saved = await allergenRepository.save({
        id: uuidv4(),
        name: fixture.name,
        icon: fixture.icon,
      } as AllergenInterface);
      allergensByName.set(fixture.name, saved);
    }
    console.log(`✅ ${allergensByName.size} allergens inserted`);

    // 3. Dietary regimes
    const dietaryRegimeRepository = dataSource.getRepository(DietaryRegimeSchema);
    const regimesByName = new Map<string, DietaryRegimeInterface>();
    for (const fixture of DIETARY_REGIMES) {
      const saved = await dietaryRegimeRepository.save({
        id: uuidv4(),
        name: fixture.name,
        description: fixture.description,
      } as DietaryRegimeInterface);
      regimesByName.set(fixture.name, saved);
    }
    console.log(`✅ ${regimesByName.size} dietary regimes inserted`);

    // 4. Dishes (+ allergen relations)
    const dishRepository = dataSource.getRepository(DishSchema);
    const dishesByName = new Map<string, DishInterface>();
    for (const fixture of DISHES) {
      const allergens = fixture.allergens.map((name) => {
        const allergen = allergensByName.get(name);
        if (!allergen) {
          throw new Error(`Unknown allergen "${name}" referenced by dish "${fixture.name}"`);
        }
        return allergen;
      });

      const saved = await dishRepository.save({
        id: uuidv4(),
        name: fixture.name,
        description: fixture.description,
        category: fixture.category,
        price: fixture.price,
        imageUrl: fixture.imageUrl,
        isAvailable: fixture.isAvailable,
        allergens,
      } as DishInterface);
      dishesByName.set(fixture.name, saved);
    }
    console.log(`✅ ${dishesByName.size} dishes inserted`);

    // 5. Menus (+ dish & dietary-regime relations)
    const menuRepository = dataSource.getRepository(MenuSchema);
    let menuCount = 0;
    for (const fixture of MENUS) {
      const dishes = fixture.dishes.map((name) => {
        const dish = dishesByName.get(name);
        if (!dish) {
          throw new Error(`Unknown dish "${name}" referenced by menu "${fixture.name}"`);
        }
        return dish;
      });
      const dietaryRegimes = fixture.dietaryRegimes.map((name) => {
        const regime = regimesByName.get(name);
        if (!regime) {
          throw new Error(`Unknown dietary regime "${name}" referenced by menu "${fixture.name}"`);
        }
        return regime;
      });

      await menuRepository.save({
        id: uuidv4(),
        name: fixture.name,
        description: fixture.description,
        theme: fixture.theme,
        price: fixture.price,
        minPersons: fixture.minPersons,
        maxPersons: fixture.maxPersons,
        stock: null,
        conditions: fixture.conditions,
        imageUrl: fixture.imageUrl,
        isAvailable: fixture.isAvailable,
        dishes,
        dietaryRegimes,
      } as unknown as Record<string, unknown>);
      menuCount += 1;
    }
    console.log(`✅ ${menuCount} menus inserted`);

    // 6. Admin user (idempotent upsert) for smoke tests / back-office login.
    const userRepository = dataSource.getRepository(UserSchema);
    const existingAdmin = await userRepository.findOne({ where: { email: ADMIN_EMAIL } });
    if (!existingAdmin) {
      const hashedPassword = await passwordService.hashPassword(ADMIN_PASSWORD);
      await userRepository.save({
        id: uuidv4(),
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: RoleType.ADMIN,
        admin: true,
        firstName: 'Admin',
        lastName: 'Vite & Gourmand',
        phone: null,
        address: null,
        city: null,
        postalCode: null,
        isActive: true,
        emailVerified: true,
        lastLoginAt: null,
        preferredLanguage: 'fr',
      } as Partial<UserInterface>);
      console.log(`✅ Admin user created (${ADMIN_EMAIL})`);
    } else {
      console.log(`ℹ️  Admin user already exists (${ADMIN_EMAIL})`);
    }

    console.log('✅ Catalog fixtures setup completed.');
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
