import api from "./axios";
import type {
  CreateVehicleDto,
  UpdateVehicleDto,
  Vehicle,
} from "@/types/vehicle";

export const vehiclesApi = {
  async getAll() {
    const res = await api.get<Vehicle[]>("/vehicles");

    return res.data;
  },

  async getById(id: string) {
    const res = await api.get<Vehicle>(`/vehicles/${id}`);

    return res.data;
  },

  async create(data: CreateVehicleDto) {
    const res = await api.post<Vehicle>("/vehicles", data);

    return res.data;
  },

  async update(id: string, data: UpdateVehicleDto) {
    const res = await api.patch<Vehicle>(`/vehicles/${id}`, data);

    return res.data;
  },

  async remove(id: string) {
    const res = await api.delete(`/vehicles/${id}`);

    return res.data;
  },
};