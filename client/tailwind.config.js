/** @type {import('tailwindcss').Config} */

const withMT = require("@material-tailwind/react/utils/withMT");
 
module.exports = withMT({
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', 'sans-serif'],
      },
      colors: {
        primary: '#314095',
        'primary-active': '#263277',
        background: '#f5f5f5',
        'card-bg': '#ffffff',
        white: 'white',
        'off-black': '#282c34',
        error: '#ff4d4f',
        success: '#52c41a',
        'primary-text': '#112A46',
        textfield: '#f5f5f5',
        'light-gray': '#f5f5f5',
        'mid-gray': '#e0e0e0',
        'dark-gray': '#333333',
       }
    },
  },
  plugins: [
    require('tailwindcss-motion'),
  ],
});