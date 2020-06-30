<template>
  <div>
    <el-table :data="data.tableConfig.tableData" border style="width: 100%">
      <!-- 多选框 -->
      <el-table-column v-if="data.selection" type="selection" width="55"></el-table-column>
      <template v-for="item in data.tableConfig.tHead">
          <!-- 插槽里自定义内容 -->
          <el-table-column  :key="item.field" :prop="item.field" :label="item.label" v-if="item.columnType" >
            <template slot-scope="scope">
              <!-- ：data表示定义的属性名 scope.row表示传的值 -->
              <slot :name="item.slotName" :data="scope.row">
                
              </slot>
            </template>
          </el-table-column>
          <!-- 文本渲染 -->
          <el-table-column  :key="item.field" :prop="item.field" :label="item.label" v-else></el-table-column>

      </template>
    </el-table>
  </div>
</template>
<script>
import { reactive, ref, onMounted, computed, onBeforeMount } from "@vue/composition-api";
export default {
  name:"Table",
  props:{
    configTable:{
      type: Object,
      default: () => {}
    },
  },
  setup(props, { root }){
    console.log(props.configTable)
    const data = reactive({
      tableConfig:{
        selection:true,
        recordCheckbox: false,
        tHead:[],
        tableData: [
          {
            username: '409019683@qq.com',
            truename: '张三',
            phone: '13788888888',
            region: '上海市普陀区金沙江路 1518 弄',
            role: '系统管理员'
          }, 
          {
            username: '2016-05-04',
            truename: '王小虎',
            region: '上海市普陀区金沙江路 1517 弄'
          }, 
          {
            username: '2016-05-01',
            truename: '张粘结',
            region: '上海市普陀区金沙江路 1519 弄'
          }, 
          {
            username: '2016-05-03',
            truename: '王小虎',
            region: '上海市普陀区金沙江路 1516 弄'
          }
        ]
      }
    })
    // 初始化配置table
    const initTableConfig = () => {
      let configData = props.configTable
      // 遍历对象 把响应的key值的属性 替换成传进来的属性值
      for(let key in configData){
        if(configData[key]){
          data.tableConfig[key] = configData[key]
        }
      }
      console.log(data)
    }
    onBeforeMount(()=> {
      // data.tHead = props.configTable.tHead
      initTableConfig()
    })
    return {
      //reactive
      data
    }
  }
};
</script>

<style lang="scss">
</style>