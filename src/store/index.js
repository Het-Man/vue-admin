import Vue from "vue";
import Vuex from "vuex";
// import { reject, resolve } from "core-js/fn/promise";
Vue.use(Vuex);
import app from './modules/app';

export default new Vuex.Store({
  
  modules: {
    app
  }
});
