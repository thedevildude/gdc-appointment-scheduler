/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/*.{html,js,ejs}"],
  theme: {
    fontFamily: {
      sans: ["Poppins", "sans-serif"],
    },
    extend: {
      colors: {
        studio: {
          50: "#efeffe",
          100: "#e5e3fc",
          200: "#d0ccf9",
          300: "#b5acf5",
          400: "#9f8bee",
          500: "#906fe5",
          600: "#8253d8",
          700: "#6e41ba",
          800: "#5b3a99",
          900: "#4b357a",
        },
      },
    },
  },
  plugins: [],
};
