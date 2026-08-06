import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#eef7ff" },
          100: { value: "#d9ecff" },
          200: { value: "#b9dbff" },
          300: { value: "#8fc4ff" },
          400: { value: "#5ca6ff" },
          500: { value: "#2d7ff9" },
          600: { value: "#1d67db" },
          700: { value: "#1752b2" },
          800: { value: "#18458f" },
          900: { value: "#193c76" },
        },
      },

      fonts: {
        heading: { value: "Inter, sans-serif" },
        body: { value: "Inter, sans-serif" },
      },

      radii: {
        sm: { value: "8px" },
        md: { value: "12px" },
        lg: { value: "18px" },
        xl: { value: "24px" },
      },

      shadows: {
        card: {
          value: "0 8px 30px rgba(0,0,0,0.08)",
        },
      },
    },

    semanticTokens: {
      colors: {
        primary: {
          value: "{colors.brand.500}",
        },

        background: {
          value: {
            base: "#ffffff",
            _dark: "#0F172A",
          },
        },

        surface: {
          value: {
            base: "#F8FAFC",
            _dark: "#1E293B",
          },
        },

        border: {
          value: {
            base: "#E2E8F0",
            _dark: "#334155",
          },
        },

        text: {
          value: {
            base: "#1E293B",
            _dark: "#F8FAFC",
          },
        },
      },
    },
  },

  globalCss: {
    body: {
      bg: "background",
      color: "text",
    },

    "*::selection": {
      bg: "brand.500",
      color: "white",
    },
  },
});

export const system = createSystem(defaultConfig, config);