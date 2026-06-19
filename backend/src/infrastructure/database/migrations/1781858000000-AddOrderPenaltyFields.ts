import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrderPenaltyFields1781858000000 implements MigrationInterface {
  name = 'AddOrderPenaltyFields1781858000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD "material_penalty_applied" boolean NOT NULL DEFAULT false
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD "penalty_amount" numeric(10, 2)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "orders" DROP COLUMN "penalty_amount"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP COLUMN "material_penalty_applied"
        `);
  }
}
