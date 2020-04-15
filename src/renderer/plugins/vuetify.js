import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import Vue from 'vue';

const opts = {}

export const vuetifyPlugin = {
  install: (vue) => {
    Vue.use(Vuetify);
  }
}

export const vuetify = new Vuetify(opts);
