import { MigrationInterface, QueryRunner } from "typeorm";

export class DropServiceColoumn1743522715964 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        `ALTER TABLE "product" DROP COLUMN "is_service`
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        `ALTER TABLE "product" DROP COLUMN "is_service`
    }

}
