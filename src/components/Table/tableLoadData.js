import { reactive} from '@vue/composition-api';
import {requestUrl} from "@/api/requestUrl"
import { loadTableData } from  "@/api/common"
import store from '@/store/index'
export function loadData () {
  const tableData = reactive({
    item:[],
    total:0,
    category:[]
  })

  const tableLoadData = (params) => {
    console.log(params)
    let requestJson =params
    const resData = {
      method: requestJson.method,
      url:requestUrl[requestJson.url],
      // url:"/news/getList/",
      data: requestJson.data
    }

      loadTableData(resData).then(res => {
        tableData.item = res.data.data.data
        tableData.total = res.data.data.total
        console.log(res)
      }).catch(err => {

      })

  }
  
  const getCategory = () => {
    store.dispatch('app/getInfoCategory').then( res => {
      tableData.category = res
    })
  }
  return {
    tableData,
    tableLoadData,
    getCategory
  }
}

