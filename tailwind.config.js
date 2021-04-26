module.exports = {
  mode: 'jit',
  purge: ['./index.html', './src/**/*.tsx'],
  darkMode: false,
  theme: {
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
