import { defineConfig, type ProxyOptions } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const apiProxy: ProxyOptions = {
  target: "http://127.0.0.1:3000",
  bypass(req) {
    const accept = req.headers.accept ?? "";
    if (accept.includes("text/html")) {
      return req.url;
    }
  },
};

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/auth": apiProxy,
      "/clients": apiProxy,
      "/dashboard": apiProxy,
      "/sales": apiProxy,
      "/users": apiProxy,
      "/vehicles": apiProxy,
    },
  },
});