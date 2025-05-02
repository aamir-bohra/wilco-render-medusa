// src/repositories/location.ts
import { EntityRepository, Repository } from "typeorm"
import {Location} from "../models/location";

@EntityRepository(Location)
export class LocationRepository extends Repository<Location> {}

// import { dataSource } from "@medusajs/medusa/dist/loaders/database";
// import {Location} from "../models/location";

// const LocationRepository = dataSource.getRepository(Location);
// module.exports =  LocationRepository;