import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateReviewsContactCms1781861889725 implements MigrationInterface {
  name = 'CreateReviewsContactCms1781861889725';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "reviews" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "user_id" uuid NOT NULL,
                "order_id" uuid NOT NULL,
                "rating" integer NOT NULL,
                "comment" text,
                "is_approved" boolean NOT NULL DEFAULT false,
                "approved_by" uuid,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "uq_f5bd779b_reviews_order_id" UNIQUE ("order_id"),
                CONSTRAINT "chk_review_rating" CHECK (
                    "rating" >= 1
                    AND "rating" <= 5
                ),
                CONSTRAINT "pk_3c910644_reviews_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_review_is_approved" ON "reviews" ("is_approved")
        `);
    await queryRunner.query(`
            CREATE TABLE "contact_messages" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(255) NOT NULL,
                "email" character varying(255) NOT NULL,
                "phone" character varying(50),
                "subject" character varying(255),
                "message" text NOT NULL,
                "is_read" boolean NOT NULL DEFAULT false,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "pk_dac5fc80_contact_messages_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_contact_message_is_read" ON "contact_messages" ("is_read")
        `);
    await queryRunner.query(`
            CREATE TABLE "page_contents" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "page" text NOT NULL,
                "section" text NOT NULL,
                "content" jsonb NOT NULL DEFAULT '{}',
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_by" uuid,
                CONSTRAINT "uq_page_content_page_section" UNIQUE ("page", "section"),
                CONSTRAINT "pk_0c86f4f6_page_contents_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "operating_hours" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "day_of_week" integer NOT NULL,
                "open_time" TIME,
                "close_time" TIME,
                "is_closed" boolean NOT NULL DEFAULT false,
                CONSTRAINT "uq_f0bc00ba_operating_hours_day_of_week" UNIQUE ("day_of_week"),
                CONSTRAINT "chk_operating_hours_day" CHECK (
                    "day_of_week" >= 0
                    AND "day_of_week" <= 6
                ),
                CONSTRAINT "pk_185daa0b_operating_hours_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "reviews"
            ADD CONSTRAINT "fk_bddc8332_reviews_user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "reviews"
            ADD CONSTRAINT "fk_068c49af_reviews_order_id" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "page_contents"
            ADD CONSTRAINT "fk_page_contents_updated_by" FOREIGN KEY ("updated_by") REFERENCES "user"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "page_contents" DROP CONSTRAINT "fk_page_contents_updated_by"
        `);
    await queryRunner.query(`
            ALTER TABLE "reviews" DROP CONSTRAINT "fk_068c49af_reviews_order_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "reviews" DROP CONSTRAINT "fk_bddc8332_reviews_user_id"
        `);
    await queryRunner.query(`
            DROP TABLE "operating_hours"
        `);
    await queryRunner.query(`
            DROP TABLE "page_contents"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_contact_message_is_read"
        `);
    await queryRunner.query(`
            DROP TABLE "contact_messages"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_review_is_approved"
        `);
    await queryRunner.query(`
            DROP TABLE "reviews"
        `);
  }
}
