import {
  IsString,
  IsInt,
  IsDecimal,
  IsDateString,
} from "class-validator";
import { Type } from "class-transformer";
import { PartialType } from "@nestjs/mapped-types";


export class CreateVehicleDto {
  @IsString()
  brand!: string;

  @IsString()
  model!: string;

  @IsString()
  type!: string;

  @Type(() => Number)
  @IsInt()
  manufactureYear!: number;

  @Type(() => Number)
  @IsInt()
  mileage!: number;

  @IsString()
  condition!: string;

  @IsDecimal()
  price!: string; // class-validator expects a string

  @IsDateString()
  acquisitionDate!: string;

  @IsString()
  status!: string;

  @IsString()
  image!: string;

  @IsString()
  color!: string;
}

export class UpdateVehicleDto extends PartialType(CreateVehicleDto)  {}