export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user" | "employee";
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}