import { GetCategory } from "@/api/news";
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

  return {
    categoryItem,
    getInfoCategory
  }
}