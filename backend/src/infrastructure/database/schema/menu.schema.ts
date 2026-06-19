import { EntitySchema } from 'typeorm';

import { MenuInterface } from '@/domain/entities/menu/menu.entity.interface';

import { decimalTransformer } from '@/infrastructure/utils/decimalTransformer';

export const MenuSchema = new EntitySchema<MenuInterface>({
  name: 'menu',
  tableName: 'menus',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    name: {
      type: 'varchar',
      length: '255',
      nullable: false,
    },
    description: {
      type: 'text',
      nullable: true,
    },
    theme: {
      type: 'varchar',
      length: '255',
      nullable: true,
    },
    price: {
      type: 'numeric',
      precision: 10,
      scale: 2,
      nullable: false,
      transformer: decimalTransformer,
    },
    minPersons: {
      name: 'min_persons',
      type: 'int',
      nullable: false,
      default: 1,
    },
    maxPersons: {
      name: 'max_persons',
      type: 'int',
      nullable: true,
    },
    stock: {
      type: 'int',
      nullable: true,
    },
    conditions: {
      type: 'text',
      nullable: true,
    },
    imageUrl: {
      name: 'image_url',
      type: 'text',
      nullable: true,
    },
    isAvailable: {
      name: 'is_available',
      type: 'boolean',
      nullable: false,
      default: true,
    },
    createdAt: {
      name: 'created_at',
      type: 'timestamp with time zone',
      createDate: true,
    },
    updatedAt: {
      name: 'updated_at',
      type: 'timestamp with time zone',
      updateDate: true,
    },
  },
  indices: [
    {
      name: 'idx_menu_theme',
      columns: ['theme'],
    },
  ],
  relations: {
    dishes: {
      type: 'many-to-many',
      target: 'dish',
      joinTable: {
        name: 'menu_dishes',
        joinColumn: { name: 'menu_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'dish_id', referencedColumnName: 'id' },
      },
    },
    dietaryRegimes: {
      type: 'many-to-many',
      target: 'dietary_regime',
      joinTable: {
        name: 'menu_dietary_regimes',
        joinColumn: { name: 'menu_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'dietary_regime_id', referencedColumnName: 'id' },
      },
    },
  },
});
