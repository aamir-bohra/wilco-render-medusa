import {
    Entity,
    Column,
    JoinColumn,
    BeforeInsert,
    PrimaryColumn,
    ManyToOne,
} from "typeorm";
import { generateEntityId } from "@medusajs/medusa/dist/utils"
import { Location } from "./location";

@Entity()
export class TimeSlot {
    @PrimaryColumn({ type: 'varchar' })
    id: string

    @Column({ type: 'varchar', nullable: true })
    start_time: string

    @Column({ type: 'varchar', nullable: true })
    end_time: string

    @BeforeInsert()
    private beforeInsert(): void {
        this.id = generateEntityId(this.id, "ts")
    }

    @ManyToOne(() => Location, (location) => location.time_slots)
    @JoinColumn({ name: "location_id" })
    location: Location

    @Column({ type: 'varchar' })
    location_id : string
}