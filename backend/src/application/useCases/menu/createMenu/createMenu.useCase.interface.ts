import { MenuInterface } from '@/domain/entities/menu/menu.entity.interface';

export interface CreateMenuDataInterface {
  name: string;
  description?: string | null;
  theme?: string | null;
  price: number;
  minPersons?: number;
  maxPersons?: number | null;
  stock?: number | null;
  conditions?: string | null;
  imageUrl?: string | null;
  isAvailable?: boolean;
  dishIds?: string[];
  dietaryRegimeIds?: string[];
}

export interface CreateMenuUseCaseInterface {
  executeCreateMenu: (data: CreateMenuDataInterface) => Promise<MenuInterface>;
}
