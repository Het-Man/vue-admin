import {requestUrl} from "@/api/requestUrl"
import { loadTableData } from  "@/api/common"

const tableloData = {
  data(){
    return {
    }
  },
  created() {
    
  },
  beforeMount() {
    this.qwe()
  },
  mounted() {
    this.tableLoadData()
    
  },

  methods: {
  qwe(){
    console.log('mixins')
  },
  tableLoadData () {
    let requsetJson = this.tableConfig.requestData 
    let resData = {
      // url: requestUrl[requsetJson.url],
      url:"/news/getList/",
      method: requsetJson.method,
      data: requsetJson.data
    }
    // console.log(resData)
    // return false
    loadTableData(resData).then(res => {
      console.log(res)
      let resData = res.data.data.data
      if(resData && resData.length > 0){

        this.tableData = resData
        this.total = res.data.data.total
      }
    })
    // loadTableData(requ) 
  }    
  },
}

export default tableloData