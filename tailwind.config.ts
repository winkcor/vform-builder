import { Constants } from './src/utils/enum';

module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  important: `.${Constants.CssPrefix}`,
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
  content: [
    './vueform.config.js',
    './node_modules/@vueform/vueform/themes/tailwind/**/*.vue',
    './node_modules/@vueform/vueform/themes/tailwind/**/*.js',
    './src/**/*.{vue,ts}',
  ],
};
