// src/models/appointment.ts
import {
    Entity,
    Column,
    ManyToOne,
    PrimaryColumn,
    BeforeInsert,
    JoinColumn,
} from "typeorm"
import { generateEntityId } from "@medusajs/medusa/dist/utils"
import { Location } from "./location"
import { Product } from "./product"
import { Customer } from "@medusajs/medusa"
import { Pet } from "./pet"
import { TimeSlot } from "./timeSlot"
import { ProductVariant } from "@medusajs/medusa"

@Entity()
export class Appointment {
    @PrimaryColumn({ type: "varchar" })
    id: string

    @Column({ type: "varchar", unique: true })
    confirmation_number: string

    @Column({ type: "varchar" })
    location_id: string

    @Column({ type: "varchar" })
    product_id: string

    @Column({ type: "varchar" })
    product_variant_id: string

    @Column({ type: "varchar" })
    customer_id: string

    @Column({ type: "varchar" })
    pet_id: string

    @Column({ type: "varchar" })
    time_slot_id: string

    @Column({ type: "varchar" })
    appointment_status: string // e.g. "pending", "confirmed", "cancelled"

    @Column({ type: "date" })
    date: Date

    @Column({ type: "jsonb", nullable: true })
    location_address: {
        address: string
        zip_code: string
    }

    @ManyToOne(() => Location, (location) => location.id)
    @JoinColumn({ name: "location_id" })
    location: Location

    @ManyToOne(() => Product, (product) => product.id)
    @JoinColumn({ name: "product_id" })
    product: Product

    @ManyToOne(() => ProductVariant, (variant) => variant.id)
    @JoinColumn({ name: "product_variant_id" })
    product_variant: ProductVariant

    @ManyToOne(() => Customer, (customer) => customer.id)
    @JoinColumn({ name: "customer_id" })
    customer: Customer

    @ManyToOne(() => Pet, (pet) => pet.appointments)
    @JoinColumn({ name: "pet_id" })
    pet: Pet

    @ManyToOne(() => TimeSlot, (timeSlot) => timeSlot.id)
    @JoinColumn({ name: "time_slot_id" })
    time_slot: TimeSlot

    @BeforeInsert()
    private beforeInsert(): void {
        this.id = generateEntityId(this.id, "appt")
        this.confirmation_number = `CONF-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Date.now().toString().slice(-4)}`
    }
}
