import { reactive } from '@vue/composition-api';
import {requestUrl} from "@/api/requestUrl"
import { loadTableData } from  "@/api/common"
export function loadData () {
  const tableData = reactive({
    item:[],
    total:0
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
  return {
    tableData,
    tableLoadData
  }
}

