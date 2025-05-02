import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  ManyToMany,
  JoinTable,
  BeforeInsert,
} from "typeorm"
import { Location } from "./location"
import { generateEntityId } from "@medusajs/medusa/dist/utils"


@Entity()
export class Groomer extends BaseEntity {
  @PrimaryColumn()
  id: string

  @Column()
  name: string

  @Column()
  phone_number: string

  @Column({ nullable: true })
  email: string

  @ManyToMany(() => Location, (location) => location.groomers)
  @JoinTable({
    name: "groomer_location",
    joinColumn: {
      name: "groomer_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "location_id",
      referencedColumnName: "id",
    },
  })
  locations: Location[]

  @BeforeInsert()
private beforeInsert(): void {
  this.id = generateEntityId(this.id, "groomer");
}

}
