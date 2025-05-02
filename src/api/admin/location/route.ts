import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import ProductService from "@medusajs/medusa";

import ProductLocationService from "src/services/productlocation";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
    const { certification, address } = req.body

    const productlocationService : ProductLocationService = req.scope.resolve("productlocationService");

    const location = await productlocationService.create({
      certification, address
    })
  
    res.status(200).json({ location })
  
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const productlocationService : ProductLocationService = req.scope.resolve("productlocationService");

  if (req.query.zip_code || req.query.p_id){
    const p_id = req.query.p_id as string
    const zip_code = req.query.zip_code as string
    const location = await productlocationService.getLocationsByZipAndProduct(p_id, zip_code)
    res.status(200).json({ location })
  }
  else{
    const location = await productlocationService.list()
    res.status(200).json({ location })
  }
}