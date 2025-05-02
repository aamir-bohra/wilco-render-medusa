export declare module "@medusajs/medusa/dist/models/product" {
  interface Product {
    certifiedService?: boolean;
    petCertifications: Record<string, any>[];
    availableLocations: Record<string, any>[];
    availableDates: Date[];
    timeSlot: string[];
  }
}
