import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm"

export class GroomersAndLocations1745576860993 implements MigrationInterface {


      public async up(queryRunner: QueryRunner): Promise<void> {
        // Groomers table
        await queryRunner.createTable(
          new Table({
            name: "groomer",
            columns: [
              { name: "id", type: "varchar", isPrimary: true },
              { name: "name", type: "varchar" },
              { name: "phone_number", type: "varchar" },
              { name: "email", type: "varchar", isNullable: true },
              { name: "created_at", type: "timestamp", default: "now()" },
              { name: "updated_at", type: "timestamp", default: "now()" },
            ],
          })
        )
    
        // Join table
        await queryRunner.createTable(
          new Table({
            name: "groomer_location",
            columns: [
              { name: "groomer_id", type: "varchar", isPrimary: true },
              { name: "location_id", type: "varchar", isPrimary: true },
            ],
          })
        )
    
        // Foreign keys
        await queryRunner.createForeignKeys("groomer_location", [
          new TableForeignKey({
            columnNames: ["groomer_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "groomer",
            onDelete: "CASCADE",
          }),
          new TableForeignKey({
            columnNames: ["location_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "location",
            onDelete: "CASCADE",
          }),
        ])
    
        // Optional: Indexes
        await queryRunner.createIndex(
          "groomer_location",
          new TableIndex({ columnNames: ["groomer_id"] })
        )
    
        await queryRunner.createIndex(
          "groomer_location",
          new TableIndex({ columnNames: ["location_id"] })
        )
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("groomer_location")
        await queryRunner.dropTable("groomer")
      }
    }
    


    


