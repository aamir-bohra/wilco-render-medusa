import { BaseService } from "medusa-interfaces"
import { EntityManager } from "typeorm"
import { Pet } from "../models/pet"
import { PetRepository } from "../repositories/pet"

class PetService extends BaseService {
  protected readonly manager: EntityManager
  protected readonly petRepository: typeof PetRepository

  constructor({ manager, petRepository }) {
    super()
    this.manager = manager
    this.petRepository = petRepository
  }

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

  /**
   * Create a new pet
   */
  async createPet(data): Promise<Pet> {
    return await this.atomicPhase_(async (manager) => {
      const petRepo = manager.getRepository(Pet)
  
      const pet = petRepo.create({
        name: data.name,
        breed: data.breed,
        date_of_birth: new Date(data.date_of_birth),
        license_id: data.license_id,
        species: data.species,
        weight: data.weight
      })
  
      return await petRepo.save(pet)
    })
  }
  

  /**
   * Get a pet by ID
   */
  async getPetById(petId: string): Promise<Pet | null> {
    return await this.atomicPhase_(async (manager) => {
      const petRepo = manager.getRepository(Pet)
      return await petRepo.findOne({ where: { id: petId } })
    })
  }
}

export default PetService
