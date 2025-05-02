// src/models/location.ts
import {
  Entity,
  Column,
  ManyToMany,
  JoinTable,
  BeforeInsert,
  PrimaryColumn,
  OneToMany,
} from "typeorm";
import { Product } from "./product";
import { generateEntityId } from "@medusajs/medusa/dist/utils";
import { TimeSlot } from "./timeSlot";
import { Groomer } from "./groomer";

export type Address = {
  address: string;
  zip_code: string;
};

@Entity()
export class Location {
  @PrimaryColumn({ type: "varchar" })
  id: string;

  @Column({ type: "jsonb", nullable: true })
  certification: string[];

  @Column({ type: "jsonb", nullable: true })
  address: Address[];

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "loc");
  }

  @ManyToMany(() => Product, (product) => product.locations)
  @JoinTable({
    name: "location_products",
    joinColumn: {
      name: "location_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "product_id",
      referencedColumnName: "id",
    },
  })
  products: Product[];

  // For time slots
  @OneToMany(() => TimeSlot, (timeSlot) => timeSlot.location, {
    cascade: true,
  })
  time_slots: TimeSlot[];

  //For multiple Groomers on a location
  @ManyToMany(() => Groomer, (groomer) => groomer.locations)
  groomers: Groomer[];
}
