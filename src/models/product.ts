import { Column, Entity, ManyToMany } from "typeorm"
import {
  // alias the core entity to not cause a naming conflict
  Product as MedusaProduct,
} from "@medusajs/medusa"
import { Location } from "./location";

@Entity()
export class Product extends MedusaProduct {
    @Column({ type: "boolean", nullable: true })
    certifiedService;
  
    @Column({ type: "jsonb", default: [] })
    petCertifications;
  
    @Column({ type: "jsonb", default: [] })
    availableLocations;
  
    @Column({ type: "jsonb", default: [] })
    availableDates;
  
    @Column({ type: "jsonb", default: [] })
    timeSlot;

    // Add this to your Product class
    @ManyToMany(() => Location, (location) => location.products)
    locations: Location[]
};