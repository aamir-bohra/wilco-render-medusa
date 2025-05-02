// src/services/location.ts
import { BaseService } from "medusa-interfaces"
// import { LocationRepository } from "../repositories/location"
import { LocationRepository } from "../repositories/location"
import { Location } from "../models/location"
import { ProductService } from "@medusajs/medusa"
import { EntityManager } from "typeorm"

class ProductLocationService extends BaseService {
  // Declare the properties first
  protected readonly locationRepository: typeof LocationRepository
  protected readonly productService: ProductService
  protected readonly manager: EntityManager

  constructor({ locationRepository, productService, manager }) {
    super()
    this.locationRepository = locationRepository
    this.productService = productService
    this.manager = manager
  }

  // Add this method to implement atomicPhase_
  protected async atomicPhase_<T>(work: (transactionManager: EntityManager) => Promise<T>): Promise<T> {
    const manager = this.manager
    const queryRunner = manager.queryRunner

    if (queryRunner && queryRunner.isTransactionActive) {
      return await work(manager)
    }

    return await manager.transaction(async (transactionManager) => {
      return await work(transactionManager)
    })
  }

  async create(data): Promise<Location[]> {
    return await this.atomicPhase_(async (manager) => {
      const locationRepository = manager.getRepository(Location)
      const location = locationRepository.create(data)

      // Ensure @BeforeInsert() hook runs and id is generated
      return await locationRepository.save(location)
    })
  }

  async retrieve(id) {
    return await this.atomicPhase_(async (manager) => {
      const locationRepository = manager.getRepository(Location)
      return await locationRepository.findOne({ 
        where: { id },
        relations: ["products", "time_slots"]
      })
    })
  }

  async list() {
    return await this.atomicPhase_(async (manager) => {
      const locationRepository = manager.getRepository(Location)
      return await locationRepository.find({ 
        relations: ["products", "time_slots"]
      })
    })
  }

  async addProductsToLocation(locationId, productIds): Promise<Location> {
    return await this.atomicPhase_(async (manager) => {
      const locationRepository = manager.getRepository(Location)

      const location = await locationRepository.findOne({
        where: { id: locationId },
        relations: ["products"]
      })

      if (!location) {
        throw new Error(`Location with id: ${locationId} not found`)
      }

      const products = await Promise.all(
        productIds.map(id => this.productService.retrieve(id))
      )

      if (!location.products) {
        location.products = []
      }

      location.products = [...location.products, ...products]
      return await locationRepository.save(location)
    })
  }


  async getLocationsByProduct(productId) {
    const locationRepository = this.manager.getCustomRepository(this.locationRepository)
    return await locationRepository.createQueryBuilder("location")
      .innerJoin("location.products", "product", "product.id = :productId", { productId })
      .getMany()
  }

  async getLocationsByZipAndProduct(productId?: string, zipCode?: string): Promise<Location[]> {
    return await this.atomicPhase_(async (manager) => {
      const locationRepository = manager.getRepository(Location);
  
      const locations = await locationRepository.find({
        relations: ["products"],
      });
  
      const filtered = locations.filter((location) => {
        const matchesProduct = productId
          ? location.products?.some(product => product.id === productId)
          : false;
  
        const matchesZip = zipCode
          ? (location.address as any[]).some(addr => addr.zip_code === zipCode)
          : false;
  
        // Use OR logic instead of AND
        return matchesProduct && matchesZip;
      });
  
      return filtered;
    });
  }  
  
}

export default ProductLocationService