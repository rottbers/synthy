const colors = require('tailwindcss/colors');

module.exports = {
  mode: 'jit',
  purge: ['./index.html', './src/**/*.tsx'],
  darkMode: false,
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      ...colors,
      gray: colors.coolGray,
    },
    extend: {
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(25%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        marquee: 'marquee 4s linear infinite',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
