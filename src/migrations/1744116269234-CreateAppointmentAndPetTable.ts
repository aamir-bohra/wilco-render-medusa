import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAppointmentAndPetTable1744116269234 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "pet" (
        "id" VARCHAR NOT NULL,
        "species" VARCHAR NOT NULL,
        "breed" VARCHAR NOT NULL,
        "name" VARCHAR NOT NULL,
        "date_of_birth" DATE NOT NULL,
        "weight" INTEGER NOT NULL,
        "license_id" VARCHAR NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
        CONSTRAINT "PK_pet_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "appointment" (
        "id" VARCHAR NOT NULL,
        "confirmation_number" VARCHAR NOT NULL,
        "location_id" VARCHAR NOT NULL,
        "product_id" VARCHAR NOT NULL,
        "product_variant_id" VARCHAR NOT NULL,
        "customer_id" VARCHAR NOT NULL,
        "pet_id" VARCHAR NOT NULL,
        "time_slot_id" VARCHAR NOT NULL,
        "appointment_status" VARCHAR NOT NULL DEFAULT 'booked',
        "date" DATE,
        "location_address" JSONB,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
        CONSTRAINT "PK_appointment_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_appointment_confirmation_number" UNIQUE ("confirmation_number")
      )
    `);

    // Add foreign keys
    await queryRunner.query(`
      ALTER TABLE "appointment"
      ADD CONSTRAINT "FK_appointment_location"
      FOREIGN KEY ("location_id") REFERENCES "location"("id")
      ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "appointment"
      ADD CONSTRAINT "FK_appointment_product"
      FOREIGN KEY ("product_id") REFERENCES "product"("id")
      ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "appointment"
      ADD CONSTRAINT "FK_appointment_variant"
      FOREIGN KEY ("product_variant_id") REFERENCES "product_variant"("id")
      ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "appointment"
      ADD CONSTRAINT "FK_appointment_customer"
      FOREIGN KEY ("customer_id") REFERENCES "customer"("id")
      ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "appointment"
      ADD CONSTRAINT "FK_appointment_pet"
      FOREIGN KEY ("pet_id") REFERENCES "pet"("id")
      ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "appointment"
      ADD CONSTRAINT "FK_appointment_time_slot"
      FOREIGN KEY ("time_slot_id") REFERENCES "time_slot"("id")
      ON DELETE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "appointment" DROP CONSTRAINT "FK_appointment_time_slot"`);
    await queryRunner.query(`ALTER TABLE "appointment" DROP CONSTRAINT "FK_appointment_pet"`);
    await queryRunner.query(`ALTER TABLE "appointment" DROP CONSTRAINT "FK_appointment_customer"`);
    await queryRunner.query(`ALTER TABLE "appointment" DROP CONSTRAINT "FK_appointment_variant"`);
    await queryRunner.query(`ALTER TABLE "appointment" DROP CONSTRAINT "FK_appointment_product"`);
    await queryRunner.query(`ALTER TABLE "appointment" DROP CONSTRAINT "FK_appointment_location"`);

    await queryRunner.query(`DROP TABLE "appointment"`);
    await queryRunner.query(`DROP TABLE "pet"`);
  }

}
