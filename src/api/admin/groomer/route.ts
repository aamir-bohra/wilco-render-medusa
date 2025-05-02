// import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

// import GroomerService from "src/services/groomer";

// export async function POST(req: MedusaRequest, res: MedusaResponse) {
//   const { name, phone_number, email } = req.body;

//   const groomerService: GroomerService = req.scope.resolve("groomerService");

//   const groomer = await groomerService.create({
//     name,
//     phone_number,
//     email,
//   });

//   res.status(200).json({ groomer });
// }



// export async function GET(req: MedusaRequest, res: MedusaResponse) {
//   const { location_id } = req.query;

//   const groomerService: GroomerService = req.scope.resolve("groomerService");

//   if (location_id) {
//     const groomers = await groomerService.getGroomersByLocation(
//       location_id as string
//     );
//     res.status(200).json({ groomers });
//   } else {
//     res.status(400).json({ message: "location_id is required" });
//   }
// }

