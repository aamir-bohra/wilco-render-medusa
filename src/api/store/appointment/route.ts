import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import AppointmentService from "src/services/appointment";
import PetService from "src/services/pet";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
    const {
        location_id,
        product_id,
        variant_id,
        customer_id,
        pet_id,
        time_slot_id,
        date,
        location_address
    } = req.body

    const appointmentService: AppointmentService = req.scope.resolve("appointmentService");
    const petService: PetService = req.scope.resolve("petService")

    const appointment = await appointmentService.bookAppointment({
        location_id, product_id, variant_id, customer_id, pet_id, time_slot_id, date, location_address
    })

    const pet = await petService.getPetById(appointment.pet_id)

    return res.status(200).json({
        confirmation_number: appointment.confirmation_number,
        pet: { "name": pet.name, "breed": pet.breed, "date_of_birth": pet.date_of_birth, "license_id": pet.license_id, "sepcies": pet.species, "weight": pet.weight },
    })
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
    const { id, confirmation_number, pet_id, customer_id } = req.query
    const appointmentService: AppointmentService = req.scope.resolve("appointmentService");

    const filter: {
        id?: string,
        confirmation_number?: string,
        pet_id?: string,
        customer_id?: string
    } = {}

    if(id) filter.id = id as string
    if (confirmation_number) filter.confirmation_number = confirmation_number as string
    if (pet_id) filter.pet_id = pet_id as string
    if (customer_id) filter.customer_id = customer_id as string

    const appointment = await appointmentService.getAppointments(filter)

    res.status(200).json({ appointment });
}