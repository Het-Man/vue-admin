import { GetCategory, GetCategoryAll } from "@/api/news";
import { reactive } from "@vue/composition-api";

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