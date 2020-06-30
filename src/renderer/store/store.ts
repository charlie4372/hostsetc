import Vue from 'vue';
import Vuex from 'vuex';

import EditorModule from './modules/editor/EditorModule';

Vue.use(Vuex);

const store = new Vuex.Store({
  getters: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    canApplicationExit(_state: any, getters: any): boolean {
      return getters['editor/canApplicationExit'];
    }
  },
  modules: {
    editor: EditorModule
  }
});

export {store}
