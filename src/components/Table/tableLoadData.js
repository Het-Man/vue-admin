import { reactive } from '@vue/composition-api';
import {requestUrl} from "@/api/requestUrl"
import { loadTableData } from  "@/api/common"
export function loadData () {
  const tableData = reactive({
    item:[],
    total:0
  })

  const tableLoadData = (params) => {
    let requestJson =params
    const resData = {
      method: requestJson.method,
      // url:requestUrl[requestJson.url],
      url:"/news/getList/",
      data: requestJson.data
    }

      loadTableData(resData).then(res => {
        tableData.item = res.data.data.data
        tableData.total = res.data.data.total
        console.log(res)
        // tableData.item = [
        //   {
        //     username: '409019683@qq.com',
        //     truename: '张三',
        //     phone: '13788888888',
        //     region: '上海市普陀区金沙江路 1518 弄',
        //     role: '系统管理员'
        //   }, 
        //   {
        //     username: '2016-05-04',
        //     truename: '王小虎',
        //     region: '上海市普陀区金沙江路 1517 弄'
        //   }, 
        //   {
        //     username: '2016-05-01',
        //     truename: '张粘结',
        //     region: '上海市普陀区金沙江路 1519 弄'
        //   }, 
        //   {
        //     username: '2016-05-03',
        //     truename: '王小虎',
        //     region: '上海市普陀区金沙江路 1516 弄'
        //   }
        // ]
      }).catch(err => {

      })

  }
  return {
    tableData,
    tableLoadData
  }
}

