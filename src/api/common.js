import { GetCategory, GetCategoryAll } from "@/api/news";
import { reactive } from "@vue/composition-api";
import service from "@/utils/request";
export function common (){
  const categoryItem = reactive({
    item:[]
  })

  const getInfoCategory = () => {
    GetCategory({}).then(res=>{
      categoryItem.item = res.data.data.data
    })
  }
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
  获取七牛云token
*/
export function QiniuToKen (data){
  return service.request({
    method: 'post',
    url: "/uploadImgToken/",
    data
  })
}