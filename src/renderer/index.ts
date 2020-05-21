import Vue, { VNode } from 'vue'
import { vuetifyPlugin, vuetify } from '@renderer/plugins/vuetify';
import '@mdi/font/css/materialdesignicons.min.css';

import '@renderer/styles/_index.scss';

import App from '@renderer/views/app.vue';

import { store } from './store'

Vue.use(vuetifyPlugin);

new Vue({
  vuetify,
  store,

  // render?(createElement: CreateElement, hack: RenderContext<Props>): VNode;
  render: (h): VNode => h(App)
}).$mount('#app');
