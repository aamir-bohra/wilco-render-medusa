import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductLocationsRelations1743869242887 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          CREATE TABLE "location" (
            "id" character varying NOT NULL,
            "certification" jsonb,
            "address" jsonb,
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            CONSTRAINT "PK_location" PRIMARY KEY ("id")
          )
        `)
    
        await queryRunner.query(`
          CREATE TABLE "location_products" (
            "location_id" character varying NOT NULL,
            "product_id" character varying NOT NULL,
            CONSTRAINT "PK_location_products" PRIMARY KEY ("location_id", "product_id")
          )
        `)
    
        await queryRunner.query(`
          ALTER TABLE "location_products" 
          ADD CONSTRAINT "FK_location_products_location" 
          FOREIGN KEY ("location_id") REFERENCES "location"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `)
    
        await queryRunner.query(`
          ALTER TABLE "location_products" 
          ADD CONSTRAINT "FK_location_products_product" 
          FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `)
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "location_products" DROP CONSTRAINT "FK_location_products_product"`)
        await queryRunner.query(`ALTER TABLE "location_products" DROP CONSTRAINT "FK_location_products_location"`)
        await queryRunner.query(`DROP TABLE "location_products"`)
        await queryRunner.query(`DROP TABLE "location"`)
      }    

}
