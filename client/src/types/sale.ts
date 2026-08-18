export interface Sale {
  id: number;
  saleDate: string;
  paymentMethod: string;
  deliveryDate: string;

  userId: number;
  clientId: number;
  vehicleId: string;

  client: {
    id: number;
    name: string;
    email?: string | null;
    preferences?: string | null;
  };

  vehicle: {
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
  };

  user: {
    id: number;
    name: string;
    email: string;
  };
}