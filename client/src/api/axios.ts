import { toaster } from "@/components/ui/toaster";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;

      toaster.create({
        type: "error",
        title: "Error",
        description: Array.isArray(message)
          ? message.join(", ")
          : message || "An unexpected error occurred.",
        closable: true,
      });
    } else {
      toaster.create({
        type: "error",
        title: "Error",
        description: "An unexpected error occurred.",
        closable: true,
      });
    }

    return Promise.reject(error);
  },
);

export default api;