/** @type {import('tailwindcss').Config} */
// cb = cerulean-blue
module.exports = {
  content: [
    './src/**/*.{html,ts}',
    "./node_modules/flowbite/**/*.js"
  ],
  darkMode: 'class',
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

    },
    extend: {
      backgroundImage : {
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
