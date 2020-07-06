import service from "@/utils/request";

/**
 * 获取角色
 * @param {
  *  {}
  * } data 
  */
 export function GetRole(data = {}){
   return service.request({
       method: "post",
       url: "/role/",
       data
   })
 }