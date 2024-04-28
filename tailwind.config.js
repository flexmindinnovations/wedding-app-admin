/** @type {import('tailwindcss').Config} */
// cb = cerulean-blue
// bo = blaze-orange
// br = blue-ribbon
module.exports = {
  content: [
    './src/**/*.{html,ts}',
  ],
  darkMode: 'class',
  // important: true,
  theme: {
    extend: {
      colors: {
        dark: {
          '50': '#f5f6f6',
          '100': '#e4e7e9',
          '200': '#ccd1d5',
          '300': '#a9b1b7',
          '400': '#7e8892',
          '500': '#626c78',
          '600': '#545b66',
          '700': '#484e56',
          '800': '#40444a',
          '900': '#393b40',
          // '950': '#222428',
          '950': '#09090b',
        },
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
        bo: {
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
        br: {
          '50': '#f0f8ff',
          '100': '#e0effe',
          '200': '#b9e0fe',
          '300': '#7cc7fd',
          '400': '#36acfa',
          '500': '#0c91eb',
          '600': '#0078d4',
          '700': '#015aa3',
          '800': '#064d86',
          '900': '#0b416f',
          '950': '#07294a',
        },
      },
      backgroundImage: {
        'logo': 'url(/assets/icon/logo.jpg)'
      },
    },
  },
  plugins: [require('@tailwindcss/aspect-ratio')
    , require('@tailwindcss/forms')
    , require('@tailwindcss/typography'),
    ],
};
