import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
    const a = "Some string"
    console.log("On testing route")
    res.status(200).json({ message:"Working condition route" });
};

