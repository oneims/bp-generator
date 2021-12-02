module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "theme-primary": {
          DEFAULT: "#4f96d3",
        },
        "theme-secondary": {
          DEFAULT: "#11284F",
        },
        "theme-notify": {
          DEFAULT: "#1195b2",
        },
        "theme-panel": {
          DEFAULT: "#f5f8fa",
          dark: "#eaf0f6",
        },
        "theme-text": {
          DEFAULT: "#33475b",
          light: "#506e91",
          inverted: "#fff",
        },
        "theme-border": {
          DEFAULT: "#cbd6e2;",
        },
        "theme-dark": {
          DEFAULT: "#253342",
        },
        "theme-light": {
          DEFAULT: "#F6F6F7",
        },
      },
      maxWidth: {
        "1/4": "25%",
        "1/3": "33.33333336%",
        "1/2": "50%",
        "3/4": "75%",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};
