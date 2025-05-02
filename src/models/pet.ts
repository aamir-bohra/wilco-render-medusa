// src/models/pet.ts
import {
    Entity,
    Column,
    OneToMany,
    PrimaryColumn,
    BeforeInsert,
} from "typeorm"
import { generateEntityId } from "@medusajs/medusa/dist/utils"
import { Appointment } from "./appointment"

@Entity()
export class Pet {
    @PrimaryColumn({ type: "varchar" })
    id: string

    @Column()
    species: string // dog/cat

    @Column()
    breed: string

    @Column()
    name: string

    @Column({ type: "date" })
    date_of_birth: Date

    @Column()
    weight: number

    @Column()
    license_id: string

    @OneToMany(() => Appointment, (appointment) => appointment.pet)
    appointments: Appointment[]

    @BeforeInsert()
    private beforeInsert(): void {
        this.id = generateEntityId(this.id, "pet")
    }
}
