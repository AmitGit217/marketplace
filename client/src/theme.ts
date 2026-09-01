import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#eff6ff" },
          100: { value: "#dbeafe" },
          200: { value: "#bfdbfe" },
          300: { value: "#93c5fd" },
          400: { value: "#60a5fa" },
          500: { value: "#2563eb" },
          600: { value: "#1d4ed8" },
          700: { value: "#1e40af" },
          800: { value: "#1e3a8a" },
          900: { value: "#172554" },
        },
      },

      fonts: {
        heading: {
          value: "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        },
        body: {
          value: "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        },
      },

      radii: {
        sm: { value: "6px" },
        md: { value: "8px" },
        lg: { value: "12px" },
        xl: { value: "16px" },
        full: { value: "9999px" },
      },

      shadows: {
        xs: {
          value: "0 1px 2px rgba(15, 23, 42, 0.05)",
        },
        sm: {
          value: "0 2px 8px rgba(15, 23, 42, 0.06)",
        },
        md: {
          value: "0 6px 20px rgba(15, 23, 42, 0.08)",
        },
        lg: {
          value: "0 12px 32px rgba(15, 23, 42, 0.10)",
        },
      },

      spacing: {
        1: { value: "4px" },
        2: { value: "8px" },
        3: { value: "12px" },
        4: { value: "16px" },
        5: { value: "20px" },
        6: { value: "24px" },
        8: { value: "32px" },
        10: { value: "40px" },
        12: { value: "48px" },
        16: { value: "64px" },
      },
    },

    semanticTokens: {
      colors: {
        // ─────────────────────────────────────────────
        // Brand / Primary
        // ─────────────────────────────────────────────

        primary: {
          value: {
            base: "{colors.brand.600}",
            _dark: "{colors.brand.400}",
          },
        },

        primaryHover: {
          value: {
            base: "{colors.brand.700}",
            _dark: "{colors.brand.300}",
          },
        },

        primaryActive: {
          value: {
            base: "{colors.brand.800}",
            _dark: "{colors.brand.200}",
          },
        },

        primarySubtle: {
          value: {
            base: "{colors.brand.50}",
            _dark: "{colors.brand.900}",
          },
        },

        primaryBorder: {
          value: {
            base: "{colors.brand.200}",
            _dark: "{colors.brand.700}",
          },
        },

        // ─────────────────────────────────────────────
        // Backgrounds
        // ─────────────────────────────────────────────

        background: {
          value: {
            base: "#F8FAFC",
            _dark: "#0B1120",
          },
        },

        surface: {
          value: {
            base: "#FFFFFF",
            _dark: "#111827",
          },
        },

        surfaceAlt: {
          value: {
            base: "#F1F5F9",
            _dark: "#1F2937",
          },
        },

        surfaceHover: {
          value: {
            base: "#F8FAFC",
            _dark: "#172033",
          },
        },

        // ─────────────────────────────────────────────
        // Borders
        // ─────────────────────────────────────────────

        border: {
          value: {
            base: "#E2E8F0",
            _dark: "#273449",
          },
        },

        borderHover: {
          value: {
            base: "#CBD5E1",
            _dark: "#3A4A61",
          },
        },

        borderFocus: {
          value: {
            base: "{colors.brand.500}",
            _dark: "{colors.brand.400}",
          },
        },

        // ─────────────────────────────────────────────
        // Text
        // ─────────────────────────────────────────────

        text: {
          value: {
            base: "#0F172A",
            _dark: "#F8FAFC",
          },
        },

        textSecondary: {
          value: {
            base: "#334155",
            _dark: "#CBD5E1",
          },
        },

        textMuted: {
          value: {
            base: "#64748B",
            _dark: "#94A3B8",
          },
        },

        textDisabled: {
          value: {
            base: "#94A3B8",
            _dark: "#64748B",
          },
        },

        // ─────────────────────────────────────────────
        // Status
        // ─────────────────────────────────────────────

        success: {
          value: {
            base: "#16A34A",
            _dark: "#22C55E",
          },
        },

        successSubtle: {
          value: {
            base: "#F0FDF4",
            _dark: "#052E16",
          },
        },

        warning: {
          value: {
            base: "#D97706",
            _dark: "#F59E0B",
          },
        },

        warningSubtle: {
          value: {
            base: "#FFFBEB",
            _dark: "#451A03",
          },
        },

        danger: {
          value: {
            base: "#DC2626",
            _dark: "#EF4444",
          },
        },

        dangerSubtle: {
          value: {
            base: "#FEF2F2",
            _dark: "#450A0A",
          },
        },

        info: {
          value: {
            base: "#0284C7",
            _dark: "#38BDF8",
          },
        },

        infoSubtle: {
          value: {
            base: "#F0F9FF",
            _dark: "#082F49",
          },
        },

        // ─────────────────────────────────────────────
        // Vehicle Status
        // ─────────────────────────────────────────────

        vehicleAvailable: {
          value: {
            base: "#16A34A",
            _dark: "#22C55E",
          },
        },

        vehicleSold: {
          value: {
            base: "#7C3AED",
            _dark: "#A78BFA",
          },
        },

        vehicleReserved: {
          value: {
            base: "#D97706",
            _dark: "#F59E0B",
          },
        },

        // ─────────────────────────────────────────────
        // Overlay
        // ─────────────────────────────────────────────

        overlay: {
          value: {
            base: "rgba(15, 23, 42, 0.45)",
            _dark: "rgba(0, 0, 0, 0.65)",
          },
        },
      },
    },
  },

  globalCss: {
    "html, body": {
      margin: 0,
      padding: 0,
      minHeight: "100%",
    },

    body: {
      bg: "background",
      color: "text",
      fontFamily: "body",
      lineHeight: 1.5,
    },

    "*": {
      borderColor: "border",
    },

    "*::selection": {
      bg: "brand.500",
      color: "white",
    },

    "*:focus-visible": {
      outline: "2px solid",
      outlineColor: "borderFocus",
      outlineOffset: "2px",
    },

    "::placeholder": {
      color: "textMuted",
      opacity: 1,
    },

    "button, input, textarea, select": {
      fontFamily: "inherit",
    },
  },
});

export const system = createSystem(defaultConfig, config);