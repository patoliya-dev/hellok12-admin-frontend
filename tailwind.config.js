import forms from "@tailwindcss/forms";
import animate from "tailwindcss-animate";
import scrollbar from "tailwind-scrollbar";
import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "auth-bg": "url('@/assets/auth/bg.png')", // custom class
      },
      colors: {
        'brand-blue': '#2563EB',
        'brand-gray': {
          100: '#F9FAFB', // Light background
          200: '#F3F4F6', // Tab background
          500: '#6B7280', // Body text
          600: '#4B5563', // Subheadings
          800: '#1F2937', // Headings
        },
        border: "var(--color-border)", // slate-200
        input: "var(--color-input)", // white
        ring: "var(--color-ring)", // blue-600
        background: "var(--color-background)", // gray-50
        foreground: "var(--color-foreground)", // slate-800
        primary: {
          DEFAULT: "var(--color-primary)", // blue-600
          foreground: "var(--color-primary-foreground)", // white
        },
        secondary: {
          DEFAULT: "var(--color-secondary)", // slate-500
          foreground: "var(--color-secondary-foreground)", // white
        },
        destructive: {
          DEFAULT: "var(--color-destructive)", // red-500
          foreground: "var(--color-destructive-foreground)", // white
        },
        muted: {
          DEFAULT: "var(--color-muted)", // slate-100
          foreground: "var(--color-muted-foreground)", // slate-500
        },
        accent: {
          DEFAULT: "var(--color-accent)", // amber-500
          foreground: "var(--color-accent-foreground)", // white
        },
        sky: {
          DEFAULT: "var(--color-sky)", // sky-500
          foreground: "var(--color-sky-foreground)", // white
        },
        popover: {
          DEFAULT: "var(--color-popover)", // white
          foreground: "var(--color-popover-foreground)", // slate-800
        },
        card: {
          DEFAULT: "var(--color-card)", // white
          foreground: "var(--color-card-foreground)", // slate-800
        },
        success: {
          DEFAULT: "var(--color-success)", // emerald-500
          foreground: "var(--color-success-foreground)", // white
        },
        warning: {
          DEFAULT: "var(--color-warning)", // amber-500
          foreground: "var(--color-warning-foreground)", // white
        },
        error: {
          DEFAULT: "var(--color-error)", // red-500
          foreground: "var(--color-error-foreground)", // white
        },
        surface: "var(--color-surface)", // white
        "text-primary": "var(--color-text-primary)", // slate-800
        "text-secondary": "var(--color-text-secondary)", // slate-500
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "24px",
      },
      boxShadow: {
        subtle: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
        elevated: "0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)",
        modal: "0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        112: "28rem",
        128: "32rem",
      },
      zIndex: {
        60: "60",
        70: "70",
        80: "80",
        90: "90",
        100: "100",
      },
    },
  },
  plugins: [
    forms,
    animate,
    scrollbar,
    plugin(function ({ addComponents }) {
      addComponents({
        ".text-h1": {
          fontSize: "30px",
          "@screen sm": { fontSize: "32px" },
          "@screen md": { fontSize: "36px" },
          "@screen lg": { fontSize: "40px" },
          "@screen xl": { fontSize: "42px" },
          "@screen 2xl": { fontSize: "45px" },
        },
        ".text-h2": {
          fontSize: "20px",
          "@screen sm": { fontSize: "22px" },
          "@screen md": { fontSize: "26px" },
          "@screen lg": { fontSize: "30px" },
          "@screen xl": { fontSize: "33px" },
          "@screen 2xl": { fontSize: "35px" },
        },
        ".text-h3": {
          fontSize: "18px",
          "@screen sm": { fontSize: "20px" },
          "@screen md": { fontSize: "23px" },
          "@screen lg": { fontSize: "26px" },
          "@screen xl": { fontSize: "28px" },
          "@screen 2xl": { fontSize: "30px" },
        },
        ".text-h4": {
          fontSize: "17px",
          "@screen sm": { fontSize: "19px" },
          "@screen md": { fontSize: "21px" },
          "@screen lg": { fontSize: "23px" },
          "@screen xl": { fontSize: "25px" },
        },
        ".text-h5": {
          fontSize: "15px",
          "@screen sm": { fontSize: "16px" },
          "@screen md": { fontSize: "17px" },
          "@screen lg": { fontSize: "18px" },
          "@screen xl": { fontSize: "19px" },
          "@screen 2xl": { fontSize: "20px" },
        },
        ".text-body1": {
          fontSize: "13px",
          "@screen sm": { fontSize: "14px" },
          "@screen md": { fontSize: "15px" },
          "@screen lg": { fontSize: "16px" },
          "@screen xl": { fontSize: "16.5px" },
          "@screen 2xl": { fontSize: "18px" },
        },
        ".text-body2": {
          fontSize: "11px",
          "@screen sm": { fontSize: "12px" },
          "@screen md": { fontSize: "13px" },
          "@screen lg": { fontSize: "14px" },
        },
      });
    }),
  ],
};
