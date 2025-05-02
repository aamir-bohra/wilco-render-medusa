export default async function () {
    const imports = (await import(
      "@medusajs/medusa/dist/api/routes/admin/products/index"
    )) as any
    imports.allowedStoreProductsFields = [
      ...imports.allowedStoreProductsFields,
      "certifiedService",
      "locations"
    //   "petCertifications",
    //   "availableLocations",
    //   "availableDates",
    //   "timeSlot",
    ]
    imports.defaultStoreProductsFields = [
      ...imports.defaultStoreProductsFields,
      "certifiedService",
      "locations"
    //   "petCertifications",
    //   "availableLocations",
    //   "availableDates",
    //   "timeSlot",
    ]
  }