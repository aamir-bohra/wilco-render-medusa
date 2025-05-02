import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import TimeSlotService from "src/services/timeslot";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
    const { location_id, start_time, end_time } = req.body

    const timeslotService : TimeSlotService = req.scope.resolve("timeslotService");

    const timeslots = await timeslotService.createTimeSlot(
        location_id, start_time, end_time
    );
  
    res.status(200).json({ timeslots })
  
}