import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import AppointmentService from "src/services/appointment";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const location_id = req.query.location_id as string
  const date = req.query.date as string

  if (!location_id || !date) {
    return res.status(400).json({ message: "zip_code and date are required" })
  }

  const userDate = new Date(date)
  const today = new Date()
  const maxDate = new Date()

  today.setHours(0, 0, 0, 0)
  maxDate.setMonth(today.getMonth() + 1)
  maxDate.setHours(0, 0, 0, 0)

  if (isNaN(userDate.getTime())) {
    return res.status(400).json({ message: "Invalid date format" })
  }

  if (userDate < today) {
    return res
      .status(400)
      .json({ message: "Please select a date from today onward." })
  }

  if (userDate > maxDate) {
    return res
      .status(400)
      .json({ message: "Date should not be more than one month from today." })
  }

  const appointmentService: AppointmentService = req.scope.resolve("appointmentService")
  const appointment = await appointmentService.getAvailableAppointmentsByLocationId({ location_id, date })

  res.status(200).json({ appointment })
}