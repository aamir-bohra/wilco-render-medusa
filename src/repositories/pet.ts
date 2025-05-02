import { EntityRepository, Repository } from "typeorm"
import { Pet } from "../models/pet"

@EntityRepository(Pet)
export class PetRepository extends Repository<Pet> {}