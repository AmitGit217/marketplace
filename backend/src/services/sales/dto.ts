import {  IsDateString, IsInt, IsNumber, IsString } from "class-validator";

export class CreateSaleDto {
   @IsDateString()
   saleDate!: string;

   @IsDateString()
   deliveryDate!: string;

   @IsString()
   paymentMethod!: string;

 


  @IsInt()
  clientId!: number;

   @IsString()
   vehicleId!: string;


 }