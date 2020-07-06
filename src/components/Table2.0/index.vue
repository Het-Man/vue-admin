<template>
  <div>
    <el-table :data="tableData" border style="width: 100%">
      <!-- 多选框 -->
      <el-table-column v-if="tableConfig.selection" type="selection" width="55"></el-table-column>
      <template v-for="item in tableConfig.tHead">
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
    <el-pagination
      
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      background>
    </el-pagination>
  </div>
</template>
<script>
import tableloData from '@/mixins/tableloData'
import paginationHook from '@/mixins/paginationHook'
export default {
  name:"Table",
  props:{
    configTable:{
      type: Object,
      default: () => {}
    },
  },
  /**
   * 混入 就是封装一个js 全局都可以引入
   * 注意 data中如果同名属性 组件的覆盖 混入mixin中data
   * 混入中的生命周期也是有的 放在数组中按先后顺序执行 
   * 混入的生命周期先于组件的生命周期
   */
  mixins:[tableloData,paginationHook],
  data(){
    return {
      // name: '我是组件的name',
      tableConfig:{
        selection:true,
        recordCheckbox: false,
        tHead:[],
        requestData:'',
        paginationShow: true
      },
      tableData: []
    }
  },
  methods: {
    // 初始化配置table
    initTableConfig(){
      let configData = this.configTable
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
      this.tableConfig = {...configData}
    },
    qwe1(){
      console.log('组件')
    },
  },
  beforeMount(){
    this.initTableConfig()
    this.qwe1()
  },
  mounted(){
  },
 
};
</script>

<style lang="scss">
</style>