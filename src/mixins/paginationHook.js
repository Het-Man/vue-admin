const paginationHook  = {
  data(){
    return{
      pageSize:10,
      // 总条数
      total:100,
      // 当前页数
      currentPage:1,
      pageSizes:[10,20,50,100] 
    }
  },
  methods: {
     // 选择多少条一页
     handleSizeChange (val){
       console.log(this.tableConfig.requestData)
       this.tableConfig.requestData.data.pageSize = val
       this.tableLoadData()
     },
  // 点击页码
    handleCurrentChange(val){
      this.tableConfig.requestData.data.pageNumber = val
       this.tableLoadData()
    }
  },

}

export default paginationHook