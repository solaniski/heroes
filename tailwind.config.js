/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  purge: {
    enabled: true,
    content: ['./src/**/*.{html,ts}'],
  },
  corePlugins: {
    preflight: true,
  },
  important: true,
  theme: {
    extend: {},
  },
  plugins: [],
}

