import Vue from 'vue';
import Vuex from 'vuex';

import AppModule from './modules/AppModule';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {},
  modules: {
    app: AppModule
  }
});

export {store}
