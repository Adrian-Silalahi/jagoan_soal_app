const { fontFamily } = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "app/**/*.{ts,tsx}",
    "pages/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "views/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "4rem",
        lg: "6rem",
      },
    },
    extend: {
      colors: {
        // Landing page design system colors
        "surface-container-highest": "#35343d",
        "surface-container-lowest": "#0e0d15",
        "surface-container-high": "#2a2932",
        "surface-container-low": "#1c1b23",
        "surface-container": "#201f27",
        "surface-variant": "#35343d",
        "surface-dim": "#13121b",
        "surface-bright": "#3a3841",
        "surface-tint": "#c6bfff",
        surface: "#13121b",
        "on-surface": "#e5e0ed",
        "on-surface-variant": "#c8c4d7",
        "on-background": "#e5e0ed",
        background: "#13121b",
        primary: "#c6bfff",
        "primary-container": "#6c5ce7",
        "on-primary": "#2900a0",
        "on-primary-container": "#faf6ff",
        secondary: "#a5e7ff",
        "secondary-container": "#00d2ff",
        "on-secondary": "#003543",
        "on-secondary-container": "#00566a",
        tertiary: "#ffb77d",
        "tertiary-container": "#ac5d00",
        "on-tertiary": "#4d2600",
        error: "#ffb4ab",
        "error-container": "#93000a",
        "on-error": "#690005",
        "on-error-container": "#ffdad6",
        outline: "#928ea0",
        "outline-variant": "#474554",
        "inverse-surface": "#e5e0ed",
        "inverse-on-surface": "#312f38",
        "inverse-primary": "#5847d2",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        outfit: ["var(--font-outfit)", ...fontFamily.sans],
      },
      fontSize: {
        "hero-display": [
          "72px",
          { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "800" },
        ],
        "headline-xl": ["48px", { lineHeight: "1.2", fontWeight: "700" }],
        "headline-md": ["32px", { lineHeight: "1.3", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        "subtle-sm": ["14px", { lineHeight: "1.5", fontWeight: "400" }],
      },
      keyframes: {
        // ─── existing ───
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        // ─── new: untuk skeleton loading & card entrance ───
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(108, 92, 231, 0.2)" },
          "50%": { boxShadow: "0 0 40px rgba(108, 92, 231, 0.5)" },
        },
      },
      animation: {
        // ─── existing ───
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        // ─── new ───
        shimmer: "shimmer 2s infinite",
        "fade-in-up": "fade-in-up 0.4s ease forwards",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
