/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["[data-theme=light]"],
          primary: "#1e3a8a",
          secondary: "#64748b",
          accent: "#f59e42",
          neutral: "#111827",
          "base-100": "#f1f5f9",
          info: "#2563eb",
          success: "#059669",
          warning: "#f59e42",
          error: "#dc2626",
        },
        dark: {
          ...require("daisyui/src/theming/themes")["[data-theme=dark]"],
          primary: "#3b82f6",
          secondary: "#a0aec0",
          accent: "#f59e42",
          neutral: "#1f2937",
          "base-100": "#111827",
          info: "#3b82f6",
          success: "#10b981",
          warning: "#f59e42",
          error: "#ef4444",
        },
      },
    ],
  },
}