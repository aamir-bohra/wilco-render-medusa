import { Lifetime } from "awilix";
import { ProductService, TransactionBaseService } from "@medusajs/medusa";

export default class LocationService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED;

  private readonly productService_: ProductService;

  constructor({ productService }) {
    super(arguments[0]);
    this.productService_ = productService;
  }

  async checkLocationAvailability(productId: string, pinCode: string): Promise<{ available: boolean; locations: any[] }> {
    try {
      const product = await this.productService_.retrieve(productId, {
        select: ["id", "title", "availableLocations"],
      });
      
      const matchingLocations = product.availableLocations.filter(
        (location) => location.pin_code === pinCode
      );

      return {
        available: matchingLocations.length > 0,
        locations: matchingLocations,
      };
    } catch (error) {
      throw new Error("Error retrieving product locations.");
    }
  }
}
