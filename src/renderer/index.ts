import Vue, { VNode } from 'vue'
import { vuetifyPlugin, vuetify } from '@renderer/plugins/vuetify';
import '@mdi/font/css/materialdesignicons.min.css';
import VuetifyToast from 'vuetify-toast-snackbar';
import 'codemirror/addon/mode/simple';
import 'codemirror/addon/scroll/simplescrollbars';
import '@renderer/components/code-mirror/hosts';

import '@renderer/styles/_index.scss';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/scroll/simplescrollbars.css';

import App from '@renderer/views/app.vue';

import { store } from './store'

Vue.use(vuetifyPlugin);
// TODO: Keep reviewing this. Specify the framework explicitly to get around a bug in VuetifyToast.
// https://github.com/eolant/vuetify-toast-snackbar/issues/42
Vue.use(VuetifyToast, { $vuetify: vuetify.framework });

new Vue({
  vuetify,
  store,

  // render?(createElement: CreateElement, hack: RenderContext<Props>): VNode;
  render: (h): VNode => h(App)
}).$mount('#app');
