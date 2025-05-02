import { registerOverriddenValidators } from "@medusajs/medusa";
import { AdminPostProductsProductReq as MedusaAdminPostProductsProductReq } from "@medusajs/medusa/dist/api/routes/admin/products/update-product";
import { IsBoolean, IsOptional, IsArray, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class Location {
  @IsString()
  pin_code: string;

  @IsString()
  address: string;
}

export class AdminPostProductsProductReq extends MedusaAdminPostProductsProductReq {
  @IsOptional()
  @IsBoolean()
  certifiedService?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  petCertifications?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Location)
  availableLocations?: Location[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  availableDates?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  timeSlot?: string[];
}

registerOverriddenValidators(AdminPostProductsProductReq);
