import api from "./axios";
import type { Sale } from "@/types/sale";

export const salesApi = {
  async getAll() {
    const res = await api.get<Sale[]>("/sales");

    return res.data;
  },

  async getById(id: number) {
    const res = await api.get<Sale>(`/sales/${id}`);

    return res.data;
  },
};