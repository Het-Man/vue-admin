
import router from "./router";
import store from "./store";


import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import VueCompositionApi from '@vue/composition-api';
// 引入路由守卫
import './router/premit'

import './icon';

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(VueCompositionApi);


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
