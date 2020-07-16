import store from '../store/index'
/**
 * 全局方法
 * 判断传进来的按钮类别 在用户的按钮值中是否存在
 * 存在就显示 不存在就隐藏
 */
export function buttonPermission (permission) {
  let btn = store.getters["permission/btnPermission"]
  let role = store.getters["permission/roles"]
  // 如果用户的权限为 超级管理员 admin 就直接返回true
  return role[0] === 'admin' ? true : btn.indexOf(permission) != -1
}