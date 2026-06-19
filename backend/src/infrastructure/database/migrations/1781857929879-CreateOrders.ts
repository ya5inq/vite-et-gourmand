import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrders1781857929879 implements MigrationInterface {
  name = 'CreateOrders1781857929879';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."order_status" AS ENUM(
                'PENDING',
                'ACCEPTED',
                'PREPARING',
                'DELIVERING',
                'DELIVERED',
                'AWAITING_MATERIAL_RETURN',
                'COMPLETED',
                'REJECTED',
                'CANCELLED'
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "orders" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "user_id" uuid,
                "status" "public"."order_status" NOT NULL DEFAULT 'PENDING',
                "guest_email" character varying(255),
                "guest_name" character varying(255),
                "guest_phone" character varying(50),
                "delivery_address" character varying(255),
                "delivery_city" character varying(255),
                "delivery_postal_code" character varying(20),
                "delivery_zone_id" uuid,
                "delivery_date" date,
                "delivery_fee" numeric(10, 2) NOT NULL DEFAULT '0',
                "total_price" numeric(10, 2) NOT NULL,
                "notes" text,
                "rejection_reason" text,
                "rejected_by" uuid,
                "rejected_at" TIMESTAMP WITH TIME ZONE,
                "material_return_deadline" TIMESTAMP WITH TIME ZONE,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "pk_ecd57eb9_orders_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD CONSTRAINT "chk_orders_user_or_guest" CHECK ("user_id" IS NOT NULL OR "guest_email" IS NOT NULL)
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_order_user_id" ON "orders" ("user_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_order_status" ON "orders" ("status")
        `);
    await queryRunner.query(`
            CREATE TABLE "order_items" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "order_id" uuid NOT NULL,
                "menu_id" uuid NOT NULL,
                "quantity" integer NOT NULL DEFAULT '1',
                "unit_price" numeric(10, 2) NOT NULL,
                "line_total" numeric(10, 2) NOT NULL,
                "discount_applied" boolean NOT NULL DEFAULT false,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "pk_d1bd21af_order_items_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_order_item_order_id" ON "order_items" ("order_id")
        `);
    await queryRunner.query(`
            CREATE TABLE "order_history" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "order_id" uuid NOT NULL,
                "old_status" "public"."order_status",
                "new_status" "public"."order_status" NOT NULL,
                "changed_by" uuid,
                "reason" text,
                "contact_mode" character varying(50),
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "pk_1d0d328e_order_history_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_order_history_order_id" ON "order_history" ("order_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD CONSTRAINT "fk_5797bcb7_orders_user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD CONSTRAINT "fk_cbd29292_orders_delivery_zone_id" FOREIGN KEY ("delivery_zone_id") REFERENCES "delivery_zones"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "order_items"
            ADD CONSTRAINT "fk_c2a0cb18_order_items_order_id" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "order_items"
            ADD CONSTRAINT "fk_a414b628_order_items_menu_id" FOREIGN KEY ("menu_id") REFERENCES "menus"("id") ON DELETE RESTRICT ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "order_history"
            ADD CONSTRAINT "fk_34ac4769_order_history_order_id" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "order_history"
            ADD CONSTRAINT "fk_77f0c762_order_history_changed_by" FOREIGN KEY ("changed_by") REFERENCES "user"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "order_history" DROP CONSTRAINT "fk_77f0c762_order_history_changed_by"
        `);
    await queryRunner.query(`
            ALTER TABLE "order_history" DROP CONSTRAINT "fk_34ac4769_order_history_order_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "order_items" DROP CONSTRAINT "fk_a414b628_order_items_menu_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "order_items" DROP CONSTRAINT "fk_c2a0cb18_order_items_order_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP CONSTRAINT "fk_cbd29292_orders_delivery_zone_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP CONSTRAINT "fk_5797bcb7_orders_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP CONSTRAINT "chk_orders_user_or_guest"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_order_history_order_id"
        `);
    await queryRunner.query(`
            DROP TABLE "order_history"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_order_item_order_id"
        `);
    await queryRunner.query(`
            DROP TABLE "order_items"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_order_status"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_order_user_id"
        `);
    await queryRunner.query(`
            DROP TABLE "orders"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."order_status"
        `);
  }
}
