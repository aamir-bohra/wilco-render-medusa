// src/api/admin/groomers/[id]/location/route.ts

import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa"
import GroomerService from "src/services/groomer"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  // Make sure this matches the param name you use in your URL pattern
  const { id: groomer_id } = req.params
  const { location_id, location_ids } = req.body

  const groomerService: GroomerService = req.scope.resolve("groomerService")

  // if you want to support multiple at once:
  const ids = Array.isArray(location_ids) ? location_ids : [location_id]

  for (const locId of ids) {
    await groomerService.addGroomerToLocation(groomer_id, locId)
  }

  res.status(200).json({ message: "Groomer associated to location(s) successfully" })
}
