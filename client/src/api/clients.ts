import api from "./axios";
import type { Client } from "@/types/client";

export const clientsApi = {
  async getAll() {
    const res = await api.get<Client[]>("/clients");

    return res.data;
  },

  async getById(id: number) {
    const res = await api.get<Client>(
      `/clients/${id}`
    );

    return res.data;
  },

  async create(data: {
    name: string;
    email?: string;
    preferences?: string;
  }) {
    const res = await api.post<Client>(
      "/clients",
      data
    );

    return res.data;
  },

  async update(
    id: number,
    data: {
      name?: string;
      email?: string;
      preferences?: string;
    }
  ) {
    const res = await api.patch<Client>(
      `/clients/${id}`,
      data
    );

    return res.data;
  },

  async remove(id: number) {
    const res = await api.delete(
      `/clients/${id}`
    );

    return res.data;
  },
};