export interface UserSale {
  id: number;
  saleDate: string;
  paymentMethod: string;
  deliveryDate: string;
  vehicleId: string;
  clientId: number;

  vehicle?: {
    id: string;
    brand: string;
    model: string;
  };

  client?: {
    id: number;
    name: string;
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  preferences?: string | null;
  sales?: UserSale[];
}