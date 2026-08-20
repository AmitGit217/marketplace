import api from "./axios";
import type { Sale } from "@/types/sale";

const toISOString = (date: string) => {
  if (!date) return date;

  return new Date(
    `${date}T00:00:00`,
  ).toISOString();
};

export interface CreateSaleData {
  vehicleId: string;
  clientId: number;
  saleDate: string;
  paymentMethod: string;
  deliveryDate: string;
}

export interface UpdateSaleData {
  vehicleId?: string;
  clientId?: number;
  saleDate?: string;
  paymentMethod?: string;
  deliveryDate?: string;
}

export const salesApi = {
  async getAll() {
    const res = await api.get<Sale[]>("/sales");

    return res.data;
  },

  async getById(id: number) {
    const res = await api.get<Sale>(
      `/sales/${id}`,
    );

    return res.data;
  },

  async create(data: CreateSaleData) {
    const res = await api.post<Sale>("/sales", {
      ...data,
      saleDate: toISOString(data.saleDate),
      deliveryDate: toISOString(
        data.deliveryDate,
      ),
    });

    return res.data;
  },

  async update(
    id: number,
    data: UpdateSaleData,
  ) {
    const res = await api.patch<Sale>(
      `/sales/${id}`,
      {
        ...data,
        ...(data.saleDate && {
          saleDate: toISOString(data.saleDate),
        }),
        ...(data.deliveryDate && {
          deliveryDate: toISOString(
            data.deliveryDate,
          ),
        }),
      },
    );

    return res.data;
  },
};