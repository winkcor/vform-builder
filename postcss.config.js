import autoprefixer from 'autoprefixer';
import tailwindcss from '@tailwindcss/postcss';
import prefixSelector from 'postcss-prefix-selector';

import { Constants } from './src/utils/enum.ts';

export default {
  plugins: [
    prefixSelector({
      prefix: `.${Constants.CssPrefix}`,
      transform(prefix, selector) {
        if (selector.startsWith(':root')) return selector;
        if (selector.startsWith('html') || selector.startsWith('body')) return selector;
        return `${prefix} ${selector}`;
      },
    }),
    tailwindcss(),
    autoprefixer(),
  ],
};
