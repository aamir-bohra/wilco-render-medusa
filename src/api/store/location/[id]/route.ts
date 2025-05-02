import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import ProductLocationService from "src/services/productlocation";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
    const { id } = req.params

    const productlocationService : ProductLocationService = req.scope.resolve("productlocationService")
    const location = await productlocationService.retrieve(id);

    res.status(200).json({ location });
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
    const { id } = req.params
    const { product_ids } = req.body

    const productlocationService : ProductLocationService = req.scope.resolve("productlocationService")

    const location = await productlocationService.addProductsToLocation(id, product_ids)

    res.status(200).json({ location });
}