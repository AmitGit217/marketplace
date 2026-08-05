import {  IsDateString, IsNumber, IsString } from "class-validator";

export class CreateSaleDto {
   @IsDateString()
   saleDate!: string;

   @IsDateString()
   deliveryDate!: string;

   @IsString()
   paymentMethod!: string;

   @IsNumber()
   userId!: number;

   @IsString()
   vehicleId!: string;
 }