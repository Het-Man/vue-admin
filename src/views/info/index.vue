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
      <el-col :span="4">
        <div class='label-wrap key-work'>
          <label for >关键字：</label>
          <div class='warp-content'>
            <SelectVue :config="data.configOption" :selectData.sync='data.searchKey' />
          </div>
        </div>
      </el-col>
      <el-col :span='3'>
        <el-input v-model='searchKeyWord' placeholder='请输入内容'  style='width:100%' />
      </el-col>
      <el-col :span='2'>
        <el-button type='danger' style='width:100%' @click="search" >搜索</el-button>
      </el-col>
      <el-col :span='2' :push='2'>
        <el-button type='danger' @click="newAndEdit({title:'新增'})" class="pull-right" style='width:100%' >
          新增
        </el-button>
      </el-col>
    </el-row>
    <div class='black-space-30'></div>
    <!-- 表格 -->
    
    <TableVue 
      ref="userTable" 
      :configTable="data.configTable" 
      :tableRow.sync="data.tableRow"  
      :tableCategory.sync="data.options.category"
    >
      <!-- 作用域插槽 v-slot:status(插槽名)slotData(子传父的命名) -->
      
      <template v-slot:operation="slotData" >
       <el-button type='danger' @click="delItem(slotData.data)" size="small" v-btnPerm='"info:del"' class="btn-hiden" >删除</el-button>
        <el-button type="success" @click="newAndEdit({title:'编辑',id:slotData.data.id})" size="small" v-btnPerm='"info:edit"' class="btn-hiden" >编辑</el-button>
        <el-button type="success" @click="detailed(slotData.data)" size="small" v-btnPerm='"info:detailed"' class="btn-hiden" >编辑详情</el-button>
      </template>
      <template v-slot:tableFooterLeft >
        <el-button size="small" @click="btnDelAll" >批量删除</el-button>
      </template>
    </TableVue>
    <div class='black-space-30'></div>
    <!-- 新增弹出框 -->
    <DialogInfo :flag.sync='dialogInfo' :typeTitle='data.types' :category='data.options.category' @getListEmit='refsTableData' />
  </div>
</template>
<script>
  import { reactive, ref, onMounted, watchEffect,watch} from '@vue/composition-api'
  // 获取列表
  import {GetList,removeInfo} from '@/api/news'
  // 全局定义是否确认删除弹出框
  import { global } from "../../utils/global_v3.0"
  // 下拉框组件
  import SelectVue from "@/components/Select"
  // 弹出框组件
  import DialogInfo from './dialog/info'
  // table组件
  import TableVue from "@/components/Table"
export default {
  name:'infoIndex',
  components: { DialogInfo, SelectVue, TableVue },
  setup(props, {root, refs}){
    const { str, confirm } = global()
    // const { categoryItem, getInfoCategory } = common()
    // ==============值类型数据============
    // const searchKey = ref('')
    const searchKeyWord = ref('')
    const categoryVal = ref('')
    const dataVal = ref('')
    // 总条数
    const total = ref(0)
    // 弹出框
    const dialogInfo = ref(false)
    // loading
    const loading = ref(false)

    // ===========================对象数据======================
    const data = reactive({
      // 
      searchKey:{},
      // 下拉框组件配置
      configOption: {
        init:['id','title']
      },
      // 分类
      options:{
        category:[]
      },
      tableData : {
        item:[]
      },
      // table选择的数据
      tableRow:{},
      // 弹出框类型
      types: {},
      // table组件配置参数
      configTable:{
        selection:true,
        recordCheckbox: true,
        // 表头
        tHead:[
          {
           label: "标题" ,
           field: "title",
           width: 700
          },
          {
           label: "类别",
           field: "categoryId",
           width: 130
          },
          {
           label: "日期",
           field: "createDate",
           width: 237
          },
          {
           label: "管理人",
           field: "categoryName",
           width: 115
          },
          
          {
           label: "操作",
           field: "slot",
           columnType: "slot",
            slotName: "operation"
          },
        ],
        // 请求接口的URL
        requestData: {
          url: "getNewsList",
          method: "post",
          data:{
            pageNumber: 1,
            pageSize: 10,
          }
        }
      }
    }) 
    // ================函数 ===============================
    // 新增或者编辑弹窗
    const newAndEdit = (params) => {
      dialogInfo.value = true
      data.types ={...params}
      console.log(data.types)
    }
   
    
    //更新table数据  获取到子组件 调用更新数据方法
    const refsTableData = () => {
      refs.userTable.refreshData()
    }
    // 单个删除
    const delItem = (data) => { 
      //需要删除的id存起来
      deleteId.value = [data.id]
      confirm({
          content:'确定要删除吗？删除后无法恢复！',
          tip:'警告',
          successFn: confirmDelete
      })
    }
    // 批量删除
    const btnDelAll = () => {
      console.log(data.tableRow)
      let deleteId = data.tableRow.idItem
      console.log(deleteId.length)
      if(!deleteId || deleteId.length == 0){
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
      removeInfo({id:data.tableRow.idItem}).then(res => {
        console.log(res)
        refsTableData()
        root.$message({
          message: res.data.message,
          type:'success'
        })
      }).catch(err=>{})
    }
    // 搜索
    const search = () => {
      // console.log(data.searchKey.value)
      let searchData = formatData()
      // 用ref refs 带参数的调用table组件刷新数据的方法
      refs.userTable.paramsLoadData(searchData)
      console.log(searchData)
    }
    // 处理搜索条件数据
    const formatData = () => {
      let requestData  = {}
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
      // let searchKey = 
      if(searchKeyWord.value ){
        console.log(data.searchKey.value)
        requestData[data.searchKey.value] = searchKeyWord.value
      }
      return requestData
    }
    
    // 编辑详情
    const detailed = (params) => {
      root.$store.commit('InfoDetailed/UPDATE_STATE_VALUE',{
        id:{
          value: params.id,
          sessionKey: "infoId",
          session:true
        },
        title:{
          value: params.title,
          sessionKey: "infoTitle",
          session:true
        }
      })
      root.$router.push({
        name:'InfoDetailed',
        params: {
          id: params.id,
          title: params.title
        }
      })
    }
    /* 
      vue 2.0 mounted
    */
    onMounted(() => {
    })

    return {
      // ref
      categoryVal, dataVal, dialogInfo, total, loading,searchKeyWord,
      // reactive
      data,
      // 函数
      delItem,btnDelAll,search,newAndEdit,detailed,refsTableData
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