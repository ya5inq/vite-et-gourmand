import { EntitySchema } from 'typeorm';

import { DishCategory, DishInterface } from '@/domain/entities/dish/dish.entity.interface';

import { decimalTransformer } from '@/infrastructure/utils/decimalTransformer';

export const DishSchema = new EntitySchema<DishInterface>({
  name: 'dish',
  tableName: 'dishes',
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
    category: {
      type: 'enum',
      enum: DishCategory,
      nullable: false,
    },
    price: {
      type: 'numeric',
      precision: 10,
      scale: 2,
      nullable: true,
      transformer: decimalTransformer,
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
      name: 'idx_dish_category',
      columns: ['category'],
    },
  ],
  relations: {
    allergens: {
      type: 'many-to-many',
      target: 'allergen',
      joinTable: {
        name: 'dish_allergens',
        joinColumn: { name: 'dish_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'allergen_id', referencedColumnName: 'id' },
      },
    },
  },
});
