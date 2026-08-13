export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  type: string;
  manufactureYear: number;
  mileage: number;
  condition: string;
  price: string;
  acquisitionDate: string;
  status: string;
  image: string;
  color: string;
}

export interface CreateVehicleDto {
  brand: string;
  model: string;
  type: string;
  manufactureYear: number;
  mileage: number;
  condition: string;
  price: string;
  acquisitionDate: string;
  status: string;
  image: string;
  color: string;
}

export type UpdateVehicleDto = Partial<CreateVehicleDto>;