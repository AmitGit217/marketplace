import api from "./axios";
import type {
  AuthResponse,
  LoginDto,
  RegisterDto,
  User,
} from "../types/auth";

export const authApi = {
  async login(data: LoginDto) {
    const res = await api.post<AuthResponse>("/auth/login", data);

    localStorage.setItem("token", res.data.token);

    return res.data;
  },

  async register(data: RegisterDto) {
    const res = await api.post<AuthResponse>("/auth/register", data);

    localStorage.setItem("token", res.data.token);

    return res.data;
  },

  async me() {
    const res = await api.get<User>("/auth/me");

    return res.data;
  },

  logout() {
    localStorage.removeItem("token");
  },
};