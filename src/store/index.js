import Vue from "vue";
import Vuex from "vuex";
// import { reject, resolve } from "core-js/fn/promise";
Vue.use(Vuex);
import app from './modules/app';
import InfoDetailed from './modules/infoDetailed'
import permission from './modules/permission'

export default new Vuex.Store({
  
  modules: {
    app,
    InfoDetailed,
    permission
  }
});
