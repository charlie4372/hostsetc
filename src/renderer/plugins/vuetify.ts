import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import {VueConstructor} from 'vue';

const opts = {}

export const vuetifyPlugin = {
  install: (vue: VueConstructor): void => {
    vue.use(Vuetify);
  }
}

export const vuetify = new Vuetify(opts);
