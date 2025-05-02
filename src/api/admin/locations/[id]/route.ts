import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import ProductService from "@medusajs/medusa";

import LocationService from "src/services/location";

// export async function GET(req: MedusaRequest, res: MedusaResponse) {
//     const id = req.params.id;
//     const zip_code = req.query.pin_code

//     const locationService = req.scope.resolve("locationService")
//     console.log("This is zip code", zip_code);
//     console.log("this si some id---->", id);
//     try {
//         const productService = req.scope.resolve("productService");
//         const product = await productService.retrieve(id, {
//             select: ["availableLocations"],
//         });

//         const matchingLocations = product.availableLocations.filter(
//             (location) => location.pin_code === zip_code
//         );

//         if (matchingLocations.length > 0) {
//             res.status(200).json({
//                 available: true,
//                 locations: matchingLocations,
//             });
//         } else {
//             res.status(200).json({ available: false, locations: [] });
//         }
//     } catch (error) {
//         res.status(500).json({ message: "Internal server error." });
//     }
//     // res.status(200).json({ message: "Working route" });
// };

export async function GET(req: MedusaRequest, res: MedusaResponse) {
    console.log("inside the location route");
    const { id } = req.params;
    const { pin_code } = req.query;

    console.log("Scoped---", req.scope);
  
    if (!pin_code) {
      return res.status(400).json({ message: "pin_code is required." });
    }
  
    try {
      const locationService: LocationService = req.scope.resolve("locationService");
      const result = await locationService.checkLocationAvailability(id, pin_code as string);
  
      res.status(200).json(result);
    } catch (error) {
        console.log("error os---", error)
        res.status(500).json({ message: "Internal server error." });
    }

    // res.status(500).json({ message: "Working" });
  }

