import en from '@vueform/vueform/locales/en';
import { defineConfig } from '@vueform/vueform';
import vueform from '@vueform/vueform/dist/vueform';
import '@vueform/vueform/dist/vueform.css';

export default defineConfig({
  theme: vueform,
  locales: { en },
  locale: 'en',
  elements: [],
});
