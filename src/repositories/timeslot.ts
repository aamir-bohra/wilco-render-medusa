import { EntityRepository, Repository } from "typeorm"
import { TimeSlot } from "../models/timeSlot"

@EntityRepository(TimeSlot)
export class TimeSlotRepository extends Repository<TimeSlot> {}