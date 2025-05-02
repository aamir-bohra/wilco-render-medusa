import { registerOverriddenValidators } from "@medusajs/medusa"
import {
    AdminPostProductsReq as MedusaAdminPostProductsReq,
} from "@medusajs/medusa/dist/api/routes/admin/products/create-product"
import { IsBoolean, IsOptional, IsArray } from "class-validator"
import "./routes/admin/products/update-product-validator";

class AdminPostProductsReq extends MedusaAdminPostProductsReq {
    @IsBoolean()
    @IsOptional()
    certifiedService?: boolean;

    @IsArray()
    @IsOptional()
    petCertifications?: string[];

    @IsArray()
    @IsOptional()
    availableLocations?: string[];

    @IsArray()
    @IsOptional()
    availableDates?: string[];

    @IsArray()
    @IsOptional()
    timeSlot?: string[];
}

registerOverriddenValidators(AdminPostProductsReq)