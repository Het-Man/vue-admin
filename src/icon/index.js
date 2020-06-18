import Vue from 'vue';
import Svgicon from './SvgIcon.vue'
Vue.component('svg-icon',Svgicon)
// 解析svg文件
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => {
  return requireContext.keys().map(requireContext)
}
requireAll(req)
