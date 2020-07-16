/**
 * 自定义指令
 * btnPerm根据权限判断按钮是否渲染
 */
import Vue from "vue"
import store from "../store/index"

 Vue.directive('btnPerm',{
  //父级未渲染
  bind:function(el,bingind, vnode){
    // el是当前元素dom元素
    //bingind 里面有指令传过来的 vlaue值 还有def属性中有自定义方法 还有其他方法
    if(bingind.def.hasBtnPerm(bingind.value)){
      el.className = el.className + " btn-show"
    }
  },  
  // 操作父节点
  inserted: function (){

  },
  update:function (){},
  componentUpdated: function (){},
  unbind:function (){},
  hasBtnPerm: function(permission){
    const button = store.getters['permission/btnPermission'] //请求到的数据权限
    const roles = store.getters['permission/roles'] //请求到的角色权限
    
    return roles.includes('admin') ? true : button.indexOf(permission) != -1;

  }

 })