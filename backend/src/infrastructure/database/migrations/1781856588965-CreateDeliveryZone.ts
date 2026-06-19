import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDeliveryZone1781856588965 implements MigrationInterface {
  name = 'CreateDeliveryZone1781856588965';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "delivery_zones" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(255) NOT NULL,
                "postal_code" character varying(20),
                "city" character varying(255),
                "distance_km" numeric(6, 2) NOT NULL DEFAULT '0',
                "is_active" boolean NOT NULL DEFAULT true,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "pk_bfd866f2_delivery_zones_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_delivery_zone_is_active" ON "delivery_zones" ("is_active")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."idx_delivery_zone_is_active"
        `);
    await queryRunner.query(`
            DROP TABLE "delivery_zones"
        `);
  }
}
