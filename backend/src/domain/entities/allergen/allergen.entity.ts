import { AllergenInterface } from './allergen.entity.interface';

export class Allergen implements AllergenInterface {
  constructor(
    public id: string,
    public name: string,
    public icon: string | null = null,
    public createdAt: Date,
  ) {}
}
