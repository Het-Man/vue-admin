import { GetCategory, GetCategoryAll } from "@/api/news";
import { reactive } from "@vue/composition-api";
import service from "@/utils/request";
export function common (){
  const categoryItem = reactive({
    item:[]
  })
  // 获取分类
  const getInfoCategory = () => {
    GetCategory({}).then(res=>{
      categoryItem.item = res.data.data.data
    })
  }
  // 获取全部分类
  const getInfoCategoryAll = () => {
    GetCategoryAll({}).then(res=>{
      console.log(res)
      categoryItem.item = res.data.data
    })
  }

  return {
    categoryItem,
    getInfoCategory,
    getInfoCategoryAll
  }
}

/* 
  
*/
/**
 * 获取七牛云token
 * @param {
 *  AK:七牛云的密钥AK；type: string
 *  SK:七牛云的密钥SK；type: string
 *  buckety: 七牛云储存空间名称；type: string
 * } params 
 */
export function QiniuToKen (data){
  return service.request({
    method: 'post',
    url: "/uploadImgToken/",
    data
  })
}

/**
 * 获取用户列表
 * @param {
 *  method:"post/get"; type: string
 *  url: 请求地址; type: string;
 *  data: {
 *    username：用户名（string）
      truename：真实姓名（string）
      phone：手机号（number）
      pageNumber：页码（number）*
      pageSize：数量（number）*
 *  }
 * 
 * } params 
 */

export function loadTableData (params){
  return service.request({
    ...params
  })
}
/**
 * 获取获取省、市、区
 * @param {
 *  获取省份
    type："province"*
  
    获取城市
    type："city"*
    province_code：省份编码*
  
    获取区县
    type："area"*
    city_code：城市编码*
  
    获取街道
    type："street"*
    area_code：区县编码*
 * 
 * } params 
 */

export function GetCityPicker (data){
  return service.request({
    method: 'post',
    url: "/cityPicker/",
    data
  })
}




