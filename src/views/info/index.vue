<template>
  <div>
  <!-- 头部 -->
    <el-row :gutter="16">
      <el-col :span="4" >
          <div class='label-wrap category'>
            <label for >类型：</label>
            <div class='warp-content'>
              <el-select v-model="categoryVal" placeholder="请选择" style='width:100%' >
                <el-option
                  v-for="item in data.options.category"
                  :key="item.id"
                  :label="item.category_name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>
      </el-col>
      <el-col :span="7">
        <div class='label-wrap data'>
          <label for >日期：</label>
          <div class='warp-content'>
            <el-date-picker style='width:100%'
              v-model="dataVal"
              type="datetimerange"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['12:00:00', '08:00:00']">
            </el-date-picker>
          </div>
        </div>
      </el-col>
      <el-col :span="3">
        <div class='label-wrap key-work'>
          <label for >关键字：</label>
          <div class='warp-content'>
            <el-select v-model="searchKey" style='width:100%' >
              <el-option
                v-for="item in data.searchOption.item" 
                :value="item.value"
                :label="item.label"
                :key="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </div>
      </el-col>
      <el-col :span='3'>
        <el-input v-model='searchKeyWord' placeholder='请输入内容'  style='width:100%' />
      </el-col>
      <el-col :span='2'>
        <el-button type='danger' style='width:100%' @click="search" >搜索</el-button>
      </el-col>
      <el-col :span='2' :push='3'>
        <el-button type='danger' @click="newAndEdit({title:'新增'})" class="pull-right" style='width:100%' >
          新增
        </el-button>
      </el-col>
    </el-row>
    <div class='black-space-30'></div>
    <!-- 表格 -->
    <el-table
      v-loading="loading"
      :data="data.tableData.item"
      border
      @selection-change="handleSelectionChange"
      style="width: 100%">
      <el-table-column type='selection' width='45'></el-table-column>
      <el-table-column prop="title" label="标题" align="center" width='750'></el-table-column>
      <el-table-column prop="categoryId" label="类别" :formatter="toCategory" align="center" width='130'></el-table-column>
      <el-table-column prop="createDate" label="日期" :formatter="toDate" align="center"  width='237'></el-table-column>
      <el-table-column prop="categoryName" label="管理人" align="center" width='115'></el-table-column>
      <el-table-column  label="操作" align="center" >
        <template slot-scope="scope" >     
          <el-button type='danger' @click="delItem(scope.row.id)" size="small" >删除</el-button>
          <el-button type="success" @click="newAndEdit({title:'编辑',id:scope.row.id})" size="small"  >编辑</el-button>
          <el-button type="success" @click="newAndEdit({title:'编辑',id:scope.row.id})" size="small"  >编辑详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class='black-space-30'></div>
    <!-- 底部 -->
    <el-row>
      <el-col :span='13'>
        <el-button size='medium' @click="delAll" >批量删除</el-button>
      </el-col>
      <el-col :span='11'>
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-col>
    </el-row>
    <!-- 新增弹出框 -->
    <DialogInfo :flag.sync='dialogInfo' :typeTitle='data.types' :category='data.options.category' @getListEmit='getList' />
  </div>
</template>
<script>
  import { reactive, ref, onMounted, watchEffect,watch} from '@vue/composition-api'
  import {GetList,removeInfo} from '@/api/news'
  import { global } from "../../utils/global_v3.0"
  import { timestampToTime } from '@/utils/validate'
  import DialogInfo from './dialog/info'
export default {
  name:'infoIndex',
  components: { DialogInfo },
  setup(props, {root}){
    const { str, confirm } = global()
    // const { categoryItem, getInfoCategory } = common()
    // ==============值类型数据============
    const searchKey = ref('id')
    const searchKeyWord = ref('')
    const categoryVal = ref('')
    const dataVal = ref('')
    // 总条数
    const total = ref(0)
    // 弹出框
    const dialogInfo = ref(false)
    // loading
    const loading = ref(false)
    //删除id
    const deleteId = ref('')
    // 单条信息id 传给编辑弹窗
    // const 

    // ===========================对象数据======================
    const data = reactive({
      options:{
        category:[]
      },
      searchOption: {
        item: [
          {value:'id',label:"ID"},
          {value:'title',label:"标题"}
        ]
      },
      tableData : {
        item:[]
      },
      page: {
        pageNumber : 1,
        pageSize : 10
      },
      // 弹出框类型
      types: {}
    }) 
    // ================函数 ===============================
    const handleSizeChange = (val) =>{
      console.log(val)
    }
    // 新增或者编辑弹窗
    const newAndEdit = (params) => {
      dialogInfo.value = true
      data.types ={...params}
    }
    // 格式化类型
    const toCategory = (row, column, cellValue) => {
      let id = cellValue
      let categoryData = data.options.category.filter(item => item.id == id)[0];
      return categoryData.category_name

    }
    // 格式化日期
    const  toDate = (row, column, cellValue, index) => {
      return timestampToTime(cellValue)
    }
    // 点击页码
    const handleCurrentChange = (val) =>{
      data.page.pageNumber = val
      getList()

    }
    // 单个删除
    const delItem = (id) => { 
      //需要删除的id存起来
      deleteId.value = [id]
      confirm({
          content:'确定要删除吗？删除后无法恢复！',
          tip:'警告',
          successFn: confirmDelete
      })
    }
    // 批量删除
    const delAll = () => {
      console.log(deleteId.value)
      console.log(deleteId.value.length)
      if(!deleteId.value || deleteId.value.length == 0){
        root.$message({
          message:'请选择需要删除的数据',
          type:'error'
        })
        return false
      }
      confirm({
        content:'确定删除全部吗',
        type:'success',
        successFn: confirmDelete
      })
    }
    const confirmDelete  = () => {
      console.log(1)
      removeInfo({id:deleteId.value}).then(res => {
        console.log(res)
        getList()
      }).catch(err=>{})
    }
    // 获取信息列表
    const getList = () =>{
      let requestData = formatData()
      loading.value = true
      GetList(requestData).then(res => {
        let resData = res.data.data.data
        data.tableData.item = resData
        // 总条数
        total.value = res.data.data.total
        loading.value = false
      }).catch(err => {
        loading.value = false
      })
    }
    // 获取分类
    const getCategory = () => {
      root.$store.dispatch('app/getInfoCategory').then( res => {
        data.options.category = res
      })
    }
    // 搜索
    const search = () => {
      // console.log(categoryVal.value)
      // console.log(dataVal.value)
      console.log(searchKey.value)
      let data = formatData()
      getList()
      console.log(data)
    }
    // 处理数据
    const formatData = () => {
      let requestData  = {
        pageNumber: data.page.pageNumber,
        pageSize: data.page.pageSize
      }
      // 分类
      if(categoryVal.value) { requestData.categoryId = categoryVal.value}
      // 日期
      if(dataVal.value) {
        // 开始日期
        requestData.startTiem = dataVal.value[0],
        // 结束日期
        requestData.endTime = dataVal.value[1]

      }
      // 关键字
      if(searchKeyWord.value){
        requestData[searchKey.value] = searchKeyWord.value
      }
      return requestData
    }
    //选中
    const handleSelectionChange = (val) => {
      // console.log(val)
      let id = val.map(item => item.id)
      // console.log(id)
      deleteId.value = id
      // console.log(deleteId.value)
    } 
    /* 
      vue 2.0 mounted
    */
    onMounted(() => {
      getCategory()
      getList()
    })

    return {
      // ref
      categoryVal, searchKey, dataVal, dialogInfo, total, loading,searchKeyWord,
      // reactive
      data,
      // 函数
      handleSizeChange, handleCurrentChange,delItem,delAll,toDate,toCategory, handleSelectionChange,search,newAndEdit,getList
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../styles/config.scss";
.label-wrap {
    
    &.category { @include labelDom(left, 60, 40); }
    &.data {  @include labelDom(right, 93, 40); }
    &.key-work { @include labelDom(right, 99, 40) }
}
</style>