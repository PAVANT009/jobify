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
        masterui: {
          primary: "#1e3a8a", // Deep Blue
          secondary: "#64748b", // Slate Gray
          accent: "#f59e42", // Subtle Orange
          neutral: "#111827", // Very Dark Gray
          "base-100": "#f1f5f9", // Light Gray
          info: "#2563eb", // Blue-600
          success: "#059669", // Green-600
          warning: "#f59e42", // Orange-400
          error: "#dc2626", // Red-600
        },
      },
      "dark",
    ],
    darkTheme: "dark",
    defaultTheme: "masterui",
  },
}