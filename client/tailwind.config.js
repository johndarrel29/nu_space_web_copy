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
        primary: 'var(--primary)',
        'primary-active': 'var(--primary-active)',
        background: '#F0F6FF',
        'card-bg': '#ffffff',
        white: 'white',
        'off-black': '#222222',
        error: '#ff4d4f',
        success: '#52c41a',
        'primary-text': 'var(--primary)',
        textfield: '#f5f5f5',
        'light-gray': '#f5f5f5',
        'mid-gray': 'var(--mid-gray)',
        'dark-gray': 'var(--dark-gray)',
        'nu-yellow': '#FBD117',
        'primary-rso': 'var(--primary-rso)',
      }
    },
  },
  plugins: [
    require('tailwindcss-motion'),
  ],
});