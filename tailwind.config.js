/** @type {import('tailwindcss').Config} */
module.exports = {
  content: {
    relative: true,
    files: [
    "./src/**/*.{html,ts}",
    "./src/app/services/*.{html,ts}",
    "./src/app/pages/**/*.{html,ts}",
   ],
},
  theme: {
    extend: {},
  },
  plugins: [],
}

