import Vue from 'vue';
import Vuex from 'vuex';

import EditorModule from './modules/editor/EditorModule';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {},
  modules: {
    editor: EditorModule
  }
});

export {store}
