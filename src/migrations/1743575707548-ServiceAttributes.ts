import { MigrationInterface, QueryRunner } from "typeorm";

export class ServiceAttributes1743575707548 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "certifiedService" BOOLEAN`);
        await queryRunner.query(`ALTER TABLE "product" ADD "petCertifications" jsonb DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "product" ADD "availableLocations" jsonb DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "product" ADD "availableDates" jsonb DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "product" ADD "timeSlot" jsonb DEFAULT '[]'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "certifiedService"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "petCertifications"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "availableLocations"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "availableDates"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "timeSlot"`);
    }

}
