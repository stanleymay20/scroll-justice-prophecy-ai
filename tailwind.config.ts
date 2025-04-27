import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // ScrollJustice.AI custom colors
        justice: {
          primary: "#9b87f5", // Main purple accent
          secondary: "#7E69AB", // Secondary purple
          tertiary: "#6E59A5", // Tertiary purple for borders and subtle elements
          light: "#D6BCFA", // Light purple for highlights
          dark: "#1a1a2e", // Dark background
          gold: "#FFD700", // Gold accents
          accent: "#FEF7CD", // Light gold accent
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        "shine": {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        "sacred-pulse": {
          "0%, 100%": { 
            boxShadow: "0 0 15px 5px rgba(255, 215, 0, 0.3)",
            borderColor: "rgba(255, 215, 0, 0.6)"
          },
          "50%": { 
            boxShadow: "0 0 25px 5px rgba(255, 215, 0, 0.5)",
            borderColor: "rgba(255, 215, 0, 0.9)"
          },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-glow": "pulse-glow 2s infinite ease-in-out",
        "shine": "shine 8s infinite linear",
        "sacred-pulse": "sacred-pulse 4s infinite ease-in-out",
      },
      backgroundImage: {
        "sacred-gradient": "linear-gradient(135deg, rgba(255,215,0,0.15) 0%, rgba(0,0,0,0) 50%, rgba(255,215,0,0.15) 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
