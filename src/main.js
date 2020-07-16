
import router from "./router";
import store from "./store";


import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import VueCompositionApi from '@vue/composition-api';
import global from '@/utils/gloabal'
// 全部方法 引入按钮权限
import { buttonPermission } from "./utils/buttonPermission";
// 全局指令
import './utils/permission'
// 引入路由守卫
import './router/premit'

import './icon';

Vue.prototype.btnPerm = buttonPermission;

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(global);
Vue.use(VueCompositionApi);


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
