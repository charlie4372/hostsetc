import Vue from 'vue'
import { vuetifyPlugin, vuetify } from '@renderer/plugins/vuetify';
import '@mdi/font/css/materialdesignicons.min.css';

import App from '@renderer/views/app.vue';

Vue.use(vuetifyPlugin);

new Vue({
  vuetify,
  render: (h) => h(App)
}).$mount('#app');
