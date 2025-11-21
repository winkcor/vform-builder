import { createApp } from 'vue';

import './style.css';
import { createPinia } from 'pinia';
import Vueform from '@vueform/vueform';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import App from './App.vue';
import vueformConfig from './../vueform.config';

const app = createApp(App);

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'system',
  },
});
const pinia = createPinia();

app.use(Vueform, vueformConfig);
app.use(vuetify);
app.use(pinia);

app.mount('#app');
