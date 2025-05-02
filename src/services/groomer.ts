// src/services/groomer.ts

import { Lifetime } from "awilix";
import { TransactionBaseService } from "@medusajs/medusa";
import { EntityManager } from "typeorm";
import { Groomer } from "../models/groomer";
import { Location } from "../models/location";

type ConstructorParams = {
  manager: EntityManager;
};

export default class GroomerService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED;

  private readonly manager: EntityManager;

  constructor({ manager }: ConstructorParams) {
    super(arguments[0]);
    this.manager = manager;
  }

  // Create a new Groomer
  async create(data: Partial<Groomer>): Promise<Groomer> {
    const groomerRepo = this.manager.getRepository(Groomer);
    const groomer = groomerRepo.create(data);
    return await groomerRepo.save(groomer);
  }

  // Associate Groomer with Location
  async addGroomerToLocation(groomerId: string, locationId: string): Promise<void> {
    const groomerRepo = this.manager.getRepository(Groomer);
    const locationRepo = this.manager.getRepository(Location);

    const groomer = await groomerRepo.findOne({
      where: { id: groomerId },
      relations: ["locations"],
    });

    if (!groomer) {
      throw new Error(`Groomer with ID ${groomerId} not found.`);
    }

    const location = await locationRepo.findOne({ where: { id: locationId } });

    if (!location) {
      throw new Error(`Location with ID ${locationId} not found.`);
    }

    // Avoid duplicate associations
    const isAlreadyAssociated = groomer.locations.some(
      (loc) => loc.id === locationId
    );

    if (!isAlreadyAssociated) {
      groomer.locations.push(location);
      await groomerRepo.save(groomer);
    }
  }


 // Get Groomers by Location ID
async getGroomersByLocation(locationId: string): Promise<Groomer[]> {
  const groomerRepo = this.manager.getRepository(Groomer);

  const groomers = await groomerRepo
    .createQueryBuilder("groomer")
    .leftJoinAndSelect("groomer.locations", "location")
    .where("location.id = :locationId", { locationId })
    .getMany();

  return groomers;
}
}