import api from "./axios";
import type { User } from "@/types/user";

export const usersApi = {
  async getAll() {
    const res =
      await api.get<User[]>("/users");

    return res.data;
  },

  async getById(id: number) {
    const res =
      await api.get<User>(`/users/${id}`);

    return res.data;
  },

  async update(
    id: number,
    data: Partial<User>
  ) {
    const res =
      await api.patch<User>(
        `/users/${id}`,
        data
      );

    return res.data;
  },

  async remove(id: number) {
    const res =
      await api.delete(`/users/${id}`);

    return res.data;
  },
};