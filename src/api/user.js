import service from "@/utils/request";

/**
 * 获取角色
 * @param {
  *  {}
  * } data 
  */
 export function GetUserRole(data = {}){
   return service.request({
       method: "post",
       url: "/userRole/",
       data
   })
 }

/**
 * 系统列表
 */
export function GetSystem(data = {}){
  return service.request({
      method: "post",
      url: "/system/",
      data
  })
}
/**
 * 添加角色
 * @param {
  *  username：用户名（string）*
    truename：真实姓名（string）
    password：密码（string）*
    phone：手机号（number）
    region：地区（json）
    status：禁启用状态（string）*
    role：角色类型（string）*
  * } data 
  */
 export function UserAdd(data){
   return service.request({
       method: "post",
       url: "/user/add/",
       data
   })
 }
/**
 * 删除角色
 * @param {
  *  id: 用户ID（array）
  * } data 
  */
 export function UserDel(data){
   return service.request({
       method: "post",
       url: "/user/delete/",
       data
   })
 }
/**
 * 更改状态
 * @param {
  *  id: 用户ID（number）
  *  status: 状态（string）1：禁用，2：启用
  * } data 
  */
 export function UserActives(data){
   return service.request({
       method: "post",
       url: "/user/actives/",
       data
   })
 }
/**
 * 用户编辑
 * @param {
  * id：用户ID（number）*
    username：用户名（string）*
    truename：真实姓名（string）
    password：密码（string） 非必传项
    phone：手机号（number）
    region：地区（json）
    status：禁启用状态（string）*
    role：角色类型（string）*
    btnPerm：按钮权限（string）*
  * } data 
  */
 export function UserEdit(data){
   return service.request({
       method: "post",
       url: "/user/edit/",
       data
   })
 }