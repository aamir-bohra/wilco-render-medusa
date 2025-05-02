// src/services/location.ts
import { Lifetime } from "awilix"
import {
  ProductService,
  TransactionBaseService,
} from "@medusajs/medusa"
import { TimeSlot } from "../models/timeSlot"

export default class TimeSlotService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED

  private readonly productService_: ProductService

  constructor({ productService }) {
    super(arguments[0])
    this.productService_ = productService
  }

  /**
   * Check if a product is available at a given pin code
   */
  async checkLocationAvailability(productId: string, pinCode: string): Promise<{
    available: boolean
    locations: any[]
  }> {
    try {
      const product = await this.productService_.retrieve(productId, {
        select: ["id", "title", "availableLocations"],
      })

      const matchingLocations = product.availableLocations.filter(
        (location) => location.pin_code === pinCode
      )

      return {
        available: matchingLocations.length > 0,
        locations: matchingLocations,
      }
    } catch (error) {
      throw new Error("Error retrieving product locations.")
    }
  }

  /**
   * Create a time slot and associate it with a location
   */
  async createTimeSlot(
    location_id: string,
    start_time: string,
    end_time: string
  ): Promise<TimeSlot> {
    return await this.atomicPhase_(async (manager) => {
      const timeSlotRepo = manager.getRepository(TimeSlot)

      const timeSlot = timeSlotRepo.create({
        start_time,
        end_time,
        location_id,
      })

      return await timeSlotRepo.save(timeSlot)
    })
  }

  /**
   * Get all time slots for a specific location
   */
  async getTimeSlotsForLocation(locationId: string): Promise<TimeSlot[]> {
    return await this.atomicPhase_(async (manager) => {
      const timeSlotRepo = manager.getRepository(TimeSlot)

      const timeSlots = await timeSlotRepo.find({
        where: { location_id: locationId },
      })

      return timeSlots
    })
  }
}
