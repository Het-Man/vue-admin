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
                  v-for="item in options.item"
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
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
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
                v-for="item in searchOption" 
                :value="item.value"
                :label="item.category_name"
                :key="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </div>
      </el-col>
      <el-col :span='3'>
        <el-input v-model='searchKey' placeholder='请输入内容'  style='width:100%' />
      </el-col>
      <el-col :span='2'>
        <el-button type='danger' style='width:100%' >搜索</el-button>
      </el-col>
      <el-col :span='2' :push='3'>
        <el-button type='danger' @click="dialogInfo = true" class="pull-right" style='width:100%' >
          新增
        </el-button>
      </el-col>
    </el-row>
    <div class='black-space-30'></div>
    <!-- 表格 -->
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column type='selection' width='45'></el-table-column>
      <el-table-column prop="title" label="标题" align="center" width='830'></el-table-column>
      <el-table-column prop="name" label="类别" align="center" width='130'></el-table-column>
      <el-table-column prop="date" label="日期" align="center" width='237'></el-table-column>
      <el-table-column prop="user" label="管理人" align="center" width='115'></el-table-column>
      <el-table-column  label="操作" align="center" >
        <template slot-scope="scope" >     
          <el-button type='danger' @click="delItem" size="small" >删除</el-button>
          <el-button type="success" size="small"  >编辑</el-button>
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
          :total="1000">
        </el-pagination>
      </el-col>
    </el-row>
    <!-- 新增弹出框 -->
    <DialogInfo :flag.sync='dialogInfo' />
  </div>
</template>
<script>
  import { reactive, ref, onMounted, watchEffect,watch} from '@vue/composition-api'
 import { global } from "../../utils/global_v3.0"
import DialogInfo from './dialog/info'
export default {
  name:'infoIndex',
  components: { DialogInfo },
  setup(props, {root}){
    const { str, confirm } = global()
    // const { categoryItem, getInfoCategory } = common()
    // ==============值类型数据============
    const searchKey = ref('ID')
    const categoryVal = ref('')
    const dataVal = ref('')
    // 弹出框
    const dialogInfo = ref(false)

    // ===========================对象数据======================
    const options = reactive(
      {
        item:[]
      }
    )
    const searchOption = reactive([
      {value:'id',label:"ID"},
      {value:'title',label:"标题"}
    ])
    // 表格数据
    const tableData = reactive(
      [
        {
          date: '2016-05-02 19:31:31',
          name: '国内信息',
          title: '纽约市长白思豪宣布退出总统竞选 特朗普发推回应',
          user:'管理员'
        }, 
        {
          date: '2016-05-02 19:31:31',
          name: '国内信息',
          title: ' 习近平在中央政协工作会议暨庆祝中国人民政治协商会议成立70周年大会上发表重要讲',
          user:'管理员'
        }, 
        {
          date: '2016-05-02 19:31:31',
          name: '国内信息',
          title: '基里巴斯与局当台“断交”系蔡英文当局上台后断交第7国 1519 弄',
          user:'管理员'
        }, 
        {
          date: '2016-05-02 19:31:31',
          name: '国内信息',
          title: '不选了！纽约市长白思豪宣布退出2020美国大选',
          user:'管理员'
        }
      ]
    )   
    // ================函数 ===============================
    const handleSizeChange = (val) =>{
      console.log(val)
    }
    const handleCurrentChange = (val) =>{
      console.log(val)

    }
    // 单个删除
    const delItem = () => { 
      confirm({
          content:'确定要删除吗？删除后无法恢复！',
          tip:'警告',
          successFn: confirmDelete
      })
      
    }
    // 批量删除
    const delAll = () => {
      confirm({
        content:'确定删除全部吗',
        type:'success',
        successFn: confirmDelete
      })
    }
    const confirmDelete  = () => {
      console.log('删除 删除删除')
    }

    const getCategory = () => {
      root.$store.dispatch('app/getInfoCategory').then( res => {
        options.item = res
      })
    }
    onMounted(() => {
      getCategory()
    })

    return {
      // ref
      categoryVal, searchKey, dataVal,dialogInfo,
      // reactive
      searchOption, options, tableData,
      // 函数
      handleSizeChange, handleCurrentChange,delItem,delAll
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