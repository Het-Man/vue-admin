<template>
  <div>
    <el-table :data="data.tableData" border style="width: 100%" @selection-change="thatSelectCheckbox">
      <!-- 多选框 -->
      <el-table-column v-if="data.tableConfig.selection" type="selection" width="55"></el-table-column>
      <template v-for="item in data.tableConfig.tHead">
          <!-- 插槽里自定义内容 -->
          <el-table-column  :key="item.field" :prop="item.field" align="center" :label="item.label" v-if="item.columnType" >
            <template slot-scope="scope">
              <!-- ：data表示定义的属性名 scope.row表示传的值 -->
              <slot :name="item.slotName" :data="scope.row">
                
              </slot>
            </template>
          </el-table-column>
          <!-- 文本渲染 -->
          <el-table-column  :key="item.field" :prop="item.field" align="center" :label="item.label" :width="item.width" :formatter='toCategory' v-else-if="item.label =='类别'"></el-table-column>
          <el-table-column  :key="item.field" :prop="item.field" align="center" :label="item.label" :width="item.width" :formatter='toDate' v-else-if="item.label =='日期'"></el-table-column>
          <el-table-column  :key="item.field" :prop="item.field" align="center"  :label="item.label" :width="item.width" v-else></el-table-column>

      </template>
    </el-table>
    <div class="table-footer">
      <el-row>
        <el-col :span="4">
          <slot name="tableFooterLeft"></slot>
        </el-col>
        <el-col :span="20">
          <el-pagination
          class="pull-right"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageData.currentPage"
          :page-sizes="pageData.pageSizes"
          :page-size="pageData.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageData.total"
          background>
        </el-pagination>
        </el-col>
      </el-row>
    </div>
    
  </div>
</template>
<script>
import { reactive, ref, onMounted, computed, onBeforeMount, watch } from "@vue/composition-api";
// 获取url
import { requestUrl } from "@/api/requestUrl"
// 接口
import { loadTableData } from  "@/api/common"
import { loadData } from "./tableLoadData"
import { paginationHook } from "./paginationHook"
// 转换时间
  import { timestampToTime } from '@/utils/validate'
export default {
  name:"Table",
  props:{
    configTable:{
      type: Object,
      default: () => {}
    },
    tableRow:{
      type: Object,
      default: () => {}
    }
  },
  setup(props, { root, emit }){
    // 表格数据逻辑业务
    const { tableLoadData, tableData,getCategory } = loadData()
    // 页码逻辑
    const { pageData, handleSizeChange, handleCurrentChange,totalCount } = paginationHook()

    const data = reactive({
      tableConfig:{
        selection:true,
        recordCheckbox: false,
        tHead:[],
        requestData:'',
      },
      tableData: []
    })
    
    // watch
    // 监听 封装的table返回值 如果有值就赋给tableData
    watch([
      () => tableData.item,
      () => tableData.total,
      () => tableData.category
    ], ([tableData,total,category]) => {
      data.tableData = tableData
      // console.log(total)
      totalCount(total)
      // 把分类返回给父组件
      emit('update:tableCategory',category)
    })

    // 监听页码
    watch([
      () => pageData.pageSize,
      () => pageData.currentPage
      ],([pageSize,currentPage]) => {
      let pageData = data.tableConfig.requestData
      if(pageData.data){
        // 把最新的页码赋值给请求参数
        pageData.data.pageNumber = currentPage
        pageData.data.pageSize = pageSize
        // 从新请求数据
        tableLoadData(data.tableConfig.requestData)
        // console.log(1)
      }
    })
    // 初始化配置table
    const initTableConfig = () => {
      let configData = props.configTable
      /* 
        三种方式遍历父组件传来的值 赋值给子组件
        1、fon in
        2、Object.assign
        3、...扩展运算符
      */

      //第一种  
      // let keys = Object.keys(configData)  //拿到对象的key用来判断该属性是否存在
      // // 遍历对象 把响应的key值的属性 替换成传进来的属性值
      // for(let key in configData){
      //   if(keys.includes(key)){ //  ["selection", "recordCheckbox", "requestUrl", "tHead"].includes("selection")
      //     data.tableConfig[key] = configData[key]
      //   }
      // }

      // 第二种
      //  Object.assign(data.tableConfig, configData)

      // 第三种
      data.tableConfig = {...configData}
    }
    // 多选框改变触发
    const thatSelectCheckbox = (val) => {
      // 把选中的每一项数据中的id 拿出来
      let rowData = {
        idItem:val.map(item => item.id)
      }
      emit("update:tableRow",rowData)
    }

    // 返回给父组件的重新渲染数据方法
    const refreshData = () => {
      tableLoadData(data.tableConfig.requestData)
    }

    // 带参数的渲染数据方法
    const paramsLoadData = (params) => {
      console.log(params)
      // 把搜索条件合并 并且页码切回第一页
      let loadData = Object.assign({},params,{
        pageNumber: 1,
        pageSize: 10
      })
      console.log(loadData)
      // 把外面传进来的data给替换掉
      data.tableConfig.requestData.data = loadData
      tableLoadData(data.tableConfig.requestData)
    }
     // 格式化类型
    const toCategory = (row, column, cellValue) => {
      let id = cellValue
      let categoryData = tableData.category.filter(item => item.id == id)[0];
      if(!categoryData) {return false}
      return categoryData.category_name

    }
    // 格式化日期
    const  toDate = (row, column, cellValue, index) => {
      return timestampToTime(cellValue)
    }
    onBeforeMount(()=> {
      initTableConfig()
      tableLoadData(data.tableConfig.requestData)
      getCategory()

    })

    return {
      //reactive
      data,pageData,
      //function 
      handleSizeChange,handleCurrentChange,thatSelectCheckbox,refreshData,paramsLoadData,toCategory,toDate
    }
  }
};
/** 
 * table足迹使用说明
 * 组件位置：src>components > Table > index
 * 引用方式：import TableVue from "@c/Table";
 * template:
 * <TableVue 
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

  配置参数
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
  参数说明
    selection:（多选框是否显示）
      数据类型：Bollen
      可配置参数：true false
    tHead:(设置表头)
      数据类型：Array
      可配置参数：label field columnType（判断是否是插槽） slotName（插槽名）
    requestData:(请求接口的URL)
      数据类型：Object
      可配置参数: url（地址/具体地址配置在api/requestUrl文件下）method(请求方式) data:｛page:Number,PageSize:Number｝(页码)
*/
</script>

<style lang="scss" scoped>
.table-footer {
  padding: 15px 0;
}
</style>
