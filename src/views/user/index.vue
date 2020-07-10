<template>
  <div>
    <el-row>
      <el-col :span="20">
        <div class="label-wrap">
          <label>关键字：</label>
          <div class="wrap-content">
            <el-row :gutter="16">
              <!-- 下拉框 -->
              <el-col :span="3">
                <SelectVue :config="data.configOption"  :selectData.sync="data.selectData" />
              </el-col>
              <!-- input -->
              <el-col :span="4">
                <el-input  v-model="data.keyWord" placeholder="请输入搜索的关键字"></el-input>
              </el-col>
              <!-- buton搜索 -->
              <el-col :span="15">
                <el-button type="danger" @click='handleSearch' >搜索</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
      <el-col :span="4">
        <el-button type="danger" @click='handlerAddUser'>添加用户</el-button>
      </el-col>
    </el-row>
    <div class="black-space-30"></div>
     <TableVue ref="userTable" :configTable="data.configTable" :tableRow.sync="data.tableRow" >
      <!-- 作用域插槽 v-slot:status(插槽名)slotData(子传父的命名) -->
      <template v-slot:status="slotData" >
        <el-switch @change="handlerSwitch(slotData.data)"  active-color="#13ce66" inactive-color="#ff4949" v-model="slotData.data.status" active-value="2"  inactive-value="1" ></el-switch>
      </template>
      <template v-slot:operation="slotData" >
        <el-button type='danger' size="small" @click="handlerDel(slotData.data)" >删除</el-button>
        <el-button type='success' size="small" @click="handlerEdit(slotData.data)" >编辑</el-button>
      </template>
      <template v-slot:tableFooterLeft >
        <el-button size="small" @click="btnDelAll" >批量删除</el-button>
      </template>
    </TableVue>
    <!-- 弹出框 -->
    <DialogAdd :editData="data.editData" :flag.sync="data.dialog_add"  @refsTable="refsTableData" ></DialogAdd>
  </div>
</template>
<script>
import { reactive, ref, onMounted, computed, watch } from "@vue/composition-api";
// 接口
import { UserDel, UserActives } from "@/api/user"
import { global } from "@/utils/global_v3.0";
// 组件 下拉框 table 弹出框
import SelectVue from "@/components/Select"
import TableVue from "@/components/Table"
import TableVue2 from "@/components/Table2.0"
import DialogAdd from './dialog/add'
export default {
  name:'iuserIndex',
  components:{ SelectVue, TableVue,TableVue2,DialogAdd },
  setup( props, { root, refs } ){
    const { confirm } = global();
    const userTable = ref(null)
    const data = reactive({
      // 下拉框菜单配置
      configOption: {
        init:['name','phone']
      },
      // 下拉菜单数据
      selectData:{},
      //关键字
      keyWord:'',
      updateUserStatusFlag: false,
      // table选择的数据
      tableRow:{},
      // 弹出框
      dialog_add: false,
      editData: {},
      // table组件配置参数
      configTable:{
        selection:true,
        recordCheckbox: true,
        // 表头
        tHead:[
          {
           label: "邮箱/用户名" ,
           field: "username"
          },
          {
           label: "真实姓名",
           field: "truename"
          },
          {
           label: "手机号",
           field: "phone"
          },
          {
           label: "地区",
           field: "region"
          },
          {
           label: "角色",
           field: "role"
          },
          {
           label: "禁启用状态",
           field: "status" ,
           columnType: "slot",
           slotName:'status'
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
          url: "getUserList",
          method: "post",
          data:{
            pageNumber: 1,
            pageSize: 10,
          }
        }
      }
      
    })

    //方法=====================================
    // 批量删除
    const btnDelAll = () => {
      console.log(data.tableRow.idItem)
      let userId = data.tableRow.idItem
      if(!userId || userId.length === 0){
        root.$message({
          message:"请勾选需要删除的用户！！",
          type:'error'

        })
        return false
      }

      confirm({
        content: "确认删除当前信息，确认后将无法恢复！！",
        tip: "警告",
        successFn: userDelete
      })
    }
    // 删除角色
    const userDelete = () => {
      UserDel({id:data.tableRow.idItem}).then(res => {
        // console.log(refs))
        // console.log(refs.userTable) 
        //  获取到子组件 调用更新数据方法
        refsTableData()
      }).catch(err => {})
    }
    // 点击删除按钮 单个删除
    const handlerDel = (params) => {
      console.log(params)
      data.tableRow.idItem = [params.id]
      confirm({
        content: "确认删除当前信息，确认后将无法恢复！！",
        tip: "警告",
        successFn: userDelete
      })
    }
    //更新table数据  获取到子组件 调用更新数据方法
    const refsTableData = () => {
      refs.userTable.refreshData()
    }
    // 禁用启用改变
    const handlerSwitch = (params) => {
      console.log(params)
      if(data.updateUserStatusFlag){ return false}
      data.updateUserStatusFlag = true
      UserActives({id:params.id,status:params.status}).then(res => {
        console.log(res)
        root.$message({
          message: res.data.message,
          type:'success'
        })
        data.updateUserStatusFlag = !data.updateUserStatusFlag
      })
    }
    // 点击编辑弹窗
    const handlerEdit = (params) => {
      // console.log(params)
      data.dialog_add = true
      //  子组件赋值 传给 add 弹窗
      data.editData = Object.assign({},params)
    }
    // 点击添加用户
    const handlerAddUser = () => {
      data.dialog_add = true

      //  子组件赋值 传给 add 弹窗
      data.editData = Object.assign({})
    }

    //点击搜索
    const handleSearch = () => {
      // 把select组件选中的值 以及input关键字传给 table组件刷新
      let params = {
        [data.selectData.value]:data.keyWord
      }
      // 用ref refs 调用组件的方法
      refs.userTable.paramsLoadData(params)
    }
    return {
      data,userTable,
      //fn
      handlerDel, handlerEdit, btnDelAll,refsTableData,handlerSwitch,handlerAddUser,handleSearch
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../styles/config.scss";
.label-wrap {
    
     @include labelDom(left, 60, 40); 
}
</style>