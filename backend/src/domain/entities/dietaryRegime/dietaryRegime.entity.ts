import { DietaryRegimeInterface } from './dietaryRegime.entity.interface';

export class DietaryRegime implements DietaryRegimeInterface {
  constructor(
    public id: string,
    public name: string,
    public description: string | null = null,
    public createdAt: Date,
  ) {}
}
