/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Warm neutral base
        paper: "#faf8f5",
        card: "#ffffff",
        ink: "#2a2a33",
        muted: "#6b6b76",
        line: "#ece8e1",
        // Brand accent (interconnected curiosity)
        brand: {
          50: "#f1effe",
          100: "#e4e0fe",
          200: "#cbc3fd",
          300: "#ab9efb",
          400: "#8c76f8",
          500: "#6d5efc",
          600: "#5a45e8",
          700: "#4a37c0",
          800: "#3d2f9b",
          900: "#342b7c"
        },
        // Collection accents
        social: "#2f9e8f",
        family: "#e0803a"
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif']
      },
      borderRadius: {
        xl2: "1.25rem"
      },
      boxShadow: {
        card: "0 1px 2px rgba(42,42,51,0.04), 0 6px 20px rgba(42,42,51,0.06)"
      },
      maxWidth: {
        app: "32rem"
      }
    }
  },
  plugins: []
};
