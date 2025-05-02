import { MigrationInterface, QueryRunner } from "typeorm";

export class TimeSlotTable1744026557264 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "time_slot" (
              "id" character varying NOT NULL,
              "start_time" character varying NOT NULL,
              "end_time" character varying NOT NULL,
              "location_id" character varying NOT NULL,
              "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
              "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
              CONSTRAINT "PK_time_slot" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            ALTER TABLE "time_slot" 
            ADD CONSTRAINT "FK_time_slot_location" 
            FOREIGN KEY ("location_id") REFERENCES "location"("id") 
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "time_slot" 
            DROP CONSTRAINT "FK_time_slot_location"
        `);

        await queryRunner.query(`
            DROP TABLE "time_slot"
        `);
    }
}
