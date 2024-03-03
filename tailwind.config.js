/** @type {import('tailwindcss').Config} */
// cb = cerulean-blue
// bo = blaze-orange
// br = blue-ribbon
module.exports = {
  content: [
    './src/**/*.{html,ts}',
    "./node_modules/flowbite/**/*.js"
  ],
  darkMode: 'class',
  // important: true,
  theme: {
    colors: {
      cb: {
        '50': '#f0f2fe',
        '100': '#dee2fb',
        '200': '#c4cef9',
        '300': '#9badf5',
        '400': '#6c84ee',
        '500': '#3d51e6',
        '600': '#343ddc',
        '700': '#2b2bca',
        '800': '#2c29a4',
        '900': '#262682',
        '950': '#1d1c4f',
      },
      'bo': {
        '50': '#fff8ec',
        '100': '#fff0d3',
        '200': '#ffdca5',
        '300': '#ffc26d',
        '400': '#ff9d32',
        '500': '#ff7f0a',
        '600': '#ff6600',
        '700': '#cc4902',
        '800': '#a1390b',
        '900': '#82310c',
        '950': '#461604',
      },
      'br': {
        '50': '#edf8ff',
        '100': '#d6efff',
        '200': '#b5e4ff',
        '300': '#83d5ff',
        '400': '#48bcff',
        '500': '#1e9aff',
        '600': '#067aff',
        '700': '#0166ff',
        '800': '#084ec5',
        '900': '#0d459b',
        '950': '#0e2b5d',
      },

    },
    extend: {
      backgroundImage: {
        'logo': 'url(/assets/icon/logo.jpg)'
      }
    },
  },
  plugins: [require('@tailwindcss/aspect-ratio')
    , require('@tailwindcss/forms')
    , require('@tailwindcss/typography'),
  require('flowbite/plugin')
  ],
};
