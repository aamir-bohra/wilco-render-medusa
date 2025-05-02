import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import PetService from "src/services/pet";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
    const { name, breed, date_of_birth, license_id, species, weight } = req.body

    const petService : PetService = req.scope.resolve("petService");

    const pet = await petService.createPet({
        name, breed, date_of_birth, license_id, species, weight
    })
  
    res.status(200).json({ pet });
}

// export async function GET(req: MedusaRequest, res: MedusaResponse) {
//   const productlocationService : ProductLocationService = req.scope.resolve("productlocationService");

//   if (req.query.zip_code || req.query.p_id){
//     const p_id = req.query.p_id as string
//     const zip_code = req.query.zip_code as string
//     const location = await productlocationService.getLocationsByZipAndProduct(p_id, zip_code)
//     res.status(200).json({ location })
//   }
//   else{
//     const location = await productlocationService.list()
//     console.log("this is some dara=--=", location);

//     res.status(200).json({ location })
//   }
// }