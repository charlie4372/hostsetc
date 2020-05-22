import Vue, { VNode } from 'vue'
import { vuetifyPlugin, vuetify } from '@renderer/plugins/vuetify';
import '@mdi/font/css/materialdesignicons.min.css';
import VuetifyToast from 'vuetify-toast-snackbar'

import '@renderer/styles/_index.scss';

import App from '@renderer/views/app.vue';

import { store } from './store'

Vue.use(vuetifyPlugin);
Vue.use(VuetifyToast);

new Vue({
  vuetify,
  store,

  // render?(createElement: CreateElement, hack: RenderContext<Props>): VNode;
  render: (h): VNode => h(App)
}).$mount('#app');
