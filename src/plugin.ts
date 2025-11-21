import type { App } from 'vue';
import type { Pinia } from 'pinia';

import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { createPinia, getActivePinia, setActivePinia } from 'pinia';

export interface FormBuilderPluginOptions {
  $pinia?: Pinia;
}

export const FormBuilderPlugin = {
  install(app: App, options: FormBuilderPluginOptions = {}) {
    if (!app.config.globalProperties.$vuetify) {
      const vuetify = createVuetify({
        components,
        directives,
        theme: {
          defaultTheme: 'light',
        },
      });
      app.use(vuetify);
    }

    if (options.$pinia) {
      setActivePinia(options.$pinia);
    } else {
      let activePinia = getActivePinia();
      // @ts-ignore
      if (!activePinia && !app._context?.provides?.pinia) {
        activePinia = createPinia();
        app.use(activePinia);
      } else if (!activePinia) {
        // @ts-ignore
        activePinia = app._context.provides.pinia;
        if (activePinia) {
          setActivePinia(activePinia);
        }
      }
    }
  },
};

export default FormBuilderPlugin;
