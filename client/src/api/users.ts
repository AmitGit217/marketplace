import api from "./axios";
import type { User } from "@/types/user";

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  preferences?: string;
  role?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  preferences?: string;
  role?: string;
}

export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get<User[]>("/users");
    return response.data;
  },

  getById: async (id: number): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  create: async (data: CreateUserData): Promise<User> => {
    const response = await api.post<User>("/users", data);
    return response.data;
  },

  update: async (
    id: number,
    data: UpdateUserData,
  ): Promise<User> => {
    const response = await api.patch<User>(
      `/users/${id}`,
      data,
    );
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};