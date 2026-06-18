import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserAndUserToken1781797508899 implements MigrationInterface {
  name = 'CreateUserAndUserToken1781797508899';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."user_role_enum" AS ENUM('USER', 'EMPLOYEE', 'ADMIN')
        `);
    await queryRunner.query(`
            CREATE TABLE "user" (
                "id" uuid NOT NULL,
                "email" character varying(255) NOT NULL,
                "password" character varying(255) NOT NULL,
                "role" "public"."user_role_enum" NOT NULL DEFAULT 'USER',
                "admin" boolean NOT NULL DEFAULT false,
                "first_name" character varying NOT NULL,
                "last_name" character varying NOT NULL,
                "phone" character varying,
                "address" character varying,
                "city" character varying,
                "postal_code" character varying,
                "is_active" boolean NOT NULL DEFAULT true,
                "email_verified" boolean NOT NULL DEFAULT false,
                "last_login_at" TIMESTAMP WITH TIME ZONE,
                "preferred_language" character varying NOT NULL DEFAULT 'fr',
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "uq_40c27bdc_user_email" UNIQUE ("email"),
                CONSTRAINT "pk_e8701ad4_user_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "user_token" (
                "id" uuid NOT NULL,
                "user_id" uuid NOT NULL,
                "value" character varying(255) NOT NULL,
                "can_be_refreshed" boolean NOT NULL,
                "token_type" character varying(255) NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "expiration_date" TIMESTAMP WITH TIME ZONE NOT NULL,
                CONSTRAINT "uq_d91328d8_user_token_value" UNIQUE ("value"),
                CONSTRAINT "pk_767768b1_user_token_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "user_token"
            ADD CONSTRAINT "fk_9fe210f3_user_token_user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user_token" DROP CONSTRAINT "fk_9fe210f3_user_token_user_id"
        `);
    await queryRunner.query(`
            DROP TABLE "user_token"
        `);
    await queryRunner.query(`
            DROP TABLE "user"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."user_role_enum"
        `);
  }
}
