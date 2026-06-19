import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCatalog1781855514867 implements MigrationInterface {
  name = 'CreateCatalog1781855514867';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "allergens" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(255) NOT NULL,
                "icon" character varying(255),
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "uq_cb8f654a_allergens_name" UNIQUE ("name"),
                CONSTRAINT "pk_dd0321c4_allergens_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "dietary_regimes" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(255) NOT NULL,
                "description" text,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "uq_ebdd50a5_dietary_regimes_name" UNIQUE ("name"),
                CONSTRAINT "pk_a2808f92_dietary_regimes_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."dishes_category_enum" AS ENUM('entree', 'plat', 'dessert')
        `);
    await queryRunner.query(`
            CREATE TABLE "dishes" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(255) NOT NULL,
                "description" text,
                "category" "public"."dishes_category_enum" NOT NULL,
                "price" numeric(10, 2),
                "image_url" text,
                "is_available" boolean NOT NULL DEFAULT true,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "pk_56982e50_dishes_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_dish_category" ON "dishes" ("category")
        `);
    await queryRunner.query(`
            CREATE TABLE "menus" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(255) NOT NULL,
                "description" text,
                "theme" character varying(255),
                "price" numeric(10, 2) NOT NULL,
                "min_persons" integer NOT NULL DEFAULT '1',
                "max_persons" integer,
                "stock" integer,
                "conditions" text,
                "image_url" text,
                "is_available" boolean NOT NULL DEFAULT true,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "pk_c184e40b_menus_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_menu_theme" ON "menus" ("theme")
        `);
    await queryRunner.query(`
            CREATE TABLE "dish_allergens" (
                "dish_id" uuid NOT NULL,
                "allergen_id" uuid NOT NULL,
                CONSTRAINT "pk_eb349eba_dish_allergens_dish_id_allergen_id" PRIMARY KEY ("dish_id", "allergen_id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_814858be_dish_allergens_dish_id" ON "dish_allergens" ("dish_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_506c6ef5_dish_allergens_allergen_id" ON "dish_allergens" ("allergen_id")
        `);
    await queryRunner.query(`
            CREATE TABLE "menu_dishes" (
                "menu_id" uuid NOT NULL,
                "dish_id" uuid NOT NULL,
                CONSTRAINT "pk_cd4aadc4_menu_dishes_menu_id_dish_id" PRIMARY KEY ("menu_id", "dish_id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_c881878f_menu_dishes_menu_id" ON "menu_dishes" ("menu_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_758219a9_menu_dishes_dish_id" ON "menu_dishes" ("dish_id")
        `);
    await queryRunner.query(`
            CREATE TABLE "menu_dietary_regimes" (
                "menu_id" uuid NOT NULL,
                "dietary_regime_id" uuid NOT NULL,
                CONSTRAINT "pk_d5ecee31_menu_dietary_regimes_menu_id_dieta...gime_id" PRIMARY KEY ("menu_id", "dietary_regime_id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_5eec9353_menu_dietary_regimes_menu_id" ON "menu_dietary_regimes" ("menu_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_5f120eff_menu_dietary_regimes_dietary_regime_id" ON "menu_dietary_regimes" ("dietary_regime_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "dish_allergens"
            ADD CONSTRAINT "fk_f1d83afc_dish_allergens_dish_id" FOREIGN KEY ("dish_id") REFERENCES "dishes"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "dish_allergens"
            ADD CONSTRAINT "fk_8927c8f5_dish_allergens_allergen_id" FOREIGN KEY ("allergen_id") REFERENCES "allergens"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "menu_dishes"
            ADD CONSTRAINT "fk_2b98316f_menu_dishes_menu_id" FOREIGN KEY ("menu_id") REFERENCES "menus"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "menu_dishes"
            ADD CONSTRAINT "fk_31c8b663_menu_dishes_dish_id" FOREIGN KEY ("dish_id") REFERENCES "dishes"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "menu_dietary_regimes"
            ADD CONSTRAINT "fk_c0ac2952_menu_dietary_regimes_menu_id" FOREIGN KEY ("menu_id") REFERENCES "menus"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "menu_dietary_regimes"
            ADD CONSTRAINT "fk_2df0e9c6_menu_dietary_regimes_dietary_regime_id" FOREIGN KEY ("dietary_regime_id") REFERENCES "dietary_regimes"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "menu_dietary_regimes" DROP CONSTRAINT "fk_2df0e9c6_menu_dietary_regimes_dietary_regime_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "menu_dietary_regimes" DROP CONSTRAINT "fk_c0ac2952_menu_dietary_regimes_menu_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "menu_dishes" DROP CONSTRAINT "fk_31c8b663_menu_dishes_dish_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "menu_dishes" DROP CONSTRAINT "fk_2b98316f_menu_dishes_menu_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "dish_allergens" DROP CONSTRAINT "fk_8927c8f5_dish_allergens_allergen_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "dish_allergens" DROP CONSTRAINT "fk_f1d83afc_dish_allergens_dish_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_5f120eff_menu_dietary_regimes_dietary_regime_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_5eec9353_menu_dietary_regimes_menu_id"
        `);
    await queryRunner.query(`
            DROP TABLE "menu_dietary_regimes"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_758219a9_menu_dishes_dish_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_c881878f_menu_dishes_menu_id"
        `);
    await queryRunner.query(`
            DROP TABLE "menu_dishes"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_506c6ef5_dish_allergens_allergen_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_814858be_dish_allergens_dish_id"
        `);
    await queryRunner.query(`
            DROP TABLE "dish_allergens"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_menu_theme"
        `);
    await queryRunner.query(`
            DROP TABLE "menus"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_dish_category"
        `);
    await queryRunner.query(`
            DROP TABLE "dishes"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."dishes_category_enum"
        `);
    await queryRunner.query(`
            DROP TABLE "dietary_regimes"
        `);
    await queryRunner.query(`
            DROP TABLE "allergens"
        `);
  }
}
