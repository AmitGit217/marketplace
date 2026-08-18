export interface Client {
  id: number;
  name: string;
  email?: string | null;
  preferences?: string | null;

  sales?: ClientSale[];
}

export interface ClientSale {
  id: number;
  saleDate: string;
  paymentMethod: string;
  deliveryDate: string;
  vehicleId: string;

  vehicle?: {
    id: string;
    brand: string;
    model: string;
    price: string;
  };
}