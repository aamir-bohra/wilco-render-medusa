// data/seed-product-type.js

const { ProductType } = require("@medusajs/medusa");
const { MedusaApp } = require("@medusajs/modules-sdk");
const { getConfigFile } = require("medusa-core-utils");
const { createConnection } = require("typeorm");
const path = require("path");

async function seedProductTypes() {
  // Load medusa-config.js from the root
  const rootDir = path.resolve(__dirname, "..");
  const { configModule } = getConfigFile(rootDir, "medusa-config");
  console.log("Loaded DB URL:", configModule.projectConfig.database_url);


  const connection = await createConnection({
    type: "postgres",
    url: configModule.projectConfig.database_url,
    entities: [ProductType],
    migrations: [],
  });

  const productTypeRepo = connection.getRepository(ProductType);
 

  // Check if "grooming-service" product type exists
  const existingProductType = await productTypeRepo.findOne({
    where: { value: "grooming-service" },
  });

  let productType;
  if (!existingProductType) {
    // Create new product type if it doesn't exist
    productType = productTypeRepo.create({
        id : "grooming-service",    
        value: "grooming-service",
    });
    await productTypeRepo.save(productType);
    console.log("Product type 'grooming-service' created!");
  } else {
    productType = existingProductType;
    console.log("Product type 'grooming-service' already exists.");
  }
  await connection.close();
}

seedProductTypes().catch((err) => {
  console.error("Error while seeding product types :", err);
});
