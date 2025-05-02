// src/services/appointment.ts
import { BaseService } from "medusa-interfaces"
import { Appointment } from "../models/appointment"
import { EntityManager } from "typeorm"
import { TimeSlot } from "../models/timeSlot"
import { Location } from "../models/location"

type Address = {
  address: string
  zip_code: string
}

type Filter = {
  zip_code: string
  date: string
}


class AppointmentService extends BaseService {
  protected readonly manager: EntityManager

  constructor({ manager }) {
    super()
    this.manager = manager
  }

  protected async atomicPhase_<T>(work: (transactionManager: EntityManager) => Promise<T>): Promise<T> {
    const manager = this.manager
    const queryRunner = manager.queryRunner

    if (queryRunner && queryRunner.isTransactionActive) {
      return await work(manager)
    }

    return await manager.transaction(async (transactionManager) => {
      return await work(transactionManager)
    })
  }

  // ✅ Book an appointment
  async bookAppointment(data): Promise<Appointment> {
    return await this.atomicPhase_(async (manager) => {
      const apptRepo = manager.getRepository(Appointment)

      const appointment = apptRepo.create({
        location_id: data.location_id,
        product_id: data.product_id,
        product_variant_id: data.variant_id,
        customer_id: data.customer_id,
        pet_id: data.pet_id,
        time_slot_id: data.time_slot_id,
        date: data.date,
        location_address: data.location_address,
        // appointment_status: "pending", // ✅ default
      })

      return await apptRepo.save(appointment)
    })
  }

  // ✅ Get all appointments (optional filters)
  async getAppointments(filter: {
    id?: string;
    confirmation_number?: string;
    customer_id?: string;
    pet_id?: string;
  } = {}): Promise<Appointment[]> {
    return await this.atomicPhase_(async (manager) => {
      const apptRepo = manager.getRepository(Appointment)

      const where: any = {}

      if (filter.id) {
        where.id = filter.id
      }

      if (filter.customer_id) {
        where.customer_id = filter.customer_id
      }

      if (filter.pet_id) {
        where.pet_id = filter.pet_id
      }

      if (filter.confirmation_number) {
        where.confirmation_number = filter.confirmation_number
      }

      return await apptRepo.find({
        where,
        relations: [
          "location",
          "product",
          "product_variant",
          "product_variant.prices",
          "customer",
          "pet",
          "time_slot"
        ],
        order: {
          date: "DESC"
        }
      })
    })
  }


  // Next available appointments
  async getNextAvailableAppointments(filter: {
    location_id: string
    date: string // format: "YYYY-MM-DD"
  }): Promise<TimeSlot[]> {
    return await this.atomicPhase_(async (manager) => {
      const timeSlotRepo = manager.getRepository(TimeSlot)
      const appointmentRepo = manager.getRepository(Appointment)

      const { location_id, date } = filter

      // Step 1: Get all time slots for the given location & date
      const allSlots = await timeSlotRepo
        .createQueryBuilder("ts")
        .where("ts.location_id = :location_id", { location_id })
        .andWhere("CAST(ts.start_time AS time) IS NOT NULL") // optional sanity
        .getMany()

      // Step 2: Get booked slot IDs for that location & date
      const bookedAppointments = await appointmentRepo
        .createQueryBuilder("appt")
        .select("appt.time_slot_id", "time_slot_id")
        .where("appt.location_id = :location_id", { location_id })
        .andWhere("DATE(appt.date) = :date", { date })
        .andWhere("appt.appointment_status = :status", { status: "booked" })
        .getRawMany()

      const bookedSlotIds = bookedAppointments.map(a => a.time_slot_id)

      // Step 3: Filter out the booked slots
      const availableSlots = allSlots.filter(slot => !bookedSlotIds.includes(slot.id))

      return availableSlots
    })
  }

  async getAvailableAppointmentsByZip(filter: { zip_code: string; date: string }) {
    return await this.atomicPhase_(async (manager) => {
      const locationRepo = manager.getRepository(Location)
      const appointmentRepo = manager.getRepository(Appointment)

      // Get all locations with time slots
      const locations = await locationRepo.find({
        relations: ["time_slots"],
      })

      // Filter locations by zip_code
      const filteredLocations = locations.filter((location) =>
        location.address?.some((addr: Address) => addr.zip_code === filter.zip_code)
      )

      const availableAppointments: {
        location_id: string
        address: Address[]
        time_slots: TimeSlot[]
      }[] = []

      for (const location of filteredLocations) {
        // Get all booked appointments for this location & date
        const bookedAppointments = await appointmentRepo.find({
          where: {
            location_id: location.id,
            date: new Date(filter.date),
            appointment_status: "booked",
          },
          relations: ["time_slot"],
        })

        // Get the IDs of time slots that are booked
        const bookedSlotIds = new Set(
          bookedAppointments.map((a) => a.time_slot?.id)
        )

        // Filter out booked time slots
        const availableSlots = location.time_slots.filter(
          (slot) => !bookedSlotIds.has(slot.id)
        )

        // Only return if there's at least one available slot
        if (availableSlots.length > 0) {
          availableAppointments.push({
            location_id: location.id,
            address: location.address as Address[],
            time_slots: availableSlots,
          })
        }
      }

      return availableAppointments
    })
  }

  // Get available appointments based in location_id and zip_code
  async getAvailableAppointmentsByLocationId(filter: { location_id: string; date: string }) {
    return await this.atomicPhase_(async (manager) => {
      const locationRepo = manager.getRepository(Location)
      const appointmentRepo = manager.getRepository(Appointment)
  
      // Get the location by ID with its time slots
      const location = await locationRepo.findOne({
        where: { id: filter.location_id },
        relations: ["time_slots"],
      })
  
      if (!location) {
        return [] // or throw an error if location not found
      }
  
      // Get all booked appointments for this location & date
      const bookedAppointments = await appointmentRepo.find({
        where: {
          location_id: location.id,
          date: new Date(filter.date),
          appointment_status: "booked",
        },
        relations: ["time_slot"],
      })
  
      // Get the IDs of time slots that are booked
      const bookedSlotIds = new Set(
        bookedAppointments.map((a) => a.time_slot?.id)
      )
  
      // Filter out booked time slots
      const availableSlots = location.time_slots.filter(
        (slot) => !bookedSlotIds.has(slot.id)
      )
  
      // Return the location if there's at least one available slot
      if (availableSlots.length > 0) {
        return [{
          location_id: location.id,
          address: location.address as Address[],
          time_slots: availableSlots,
        }]
      }
  
      return []
    })
  }  

}

export default AppointmentService
