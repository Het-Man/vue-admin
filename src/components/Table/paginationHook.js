import { reactive } from '@vue/composition-api';

export function paginationHook  () {
  const pageData = reactive({
    pageSize:10,
    // 总条数
    total:100,
    // 当前页数
    currentPage:1,
    pageSizes:[10,20,50,100]    
  })

  // 赋值total
  const totalCount = (val) =>  {pageData.total = val}
  // 选择多少条一页
  const handleSizeChange = (val) => {pageData.pageSize = val}
  // 点击页码
  const handleCurrentChange = (val) => { pageData.currentPage = val }

  return {
    pageData,
    handleSizeChange,
    handleCurrentChange,
    totalCount
  }
}