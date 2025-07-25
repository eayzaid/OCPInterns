const variantGroup = require('tailwindcss-variant-group');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js}'],
  theme: {
    extend: {},
  },
  plugins: [variantGroup()],
};
