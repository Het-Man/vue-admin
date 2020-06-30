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
                <SelectVue :config="data.configOption" />
              </el-col>
              <!-- input -->
              <el-col :span="4">
                <el-input></el-input>
              </el-col>
              <!-- buton搜索 -->
              <el-col :span="15">
                <el-button type="danger" >搜索</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
      <el-col :span="4">
        <el-button type="danger">添加用户</el-button>
      </el-col>
    </el-row>
    <div class="black-space-30"></div>
    <TableVue :configTable="data.configTable" >
      <!-- 作用域插槽 v-slot:status(插槽名)slotData(子传父的命名) -->
      <template v-slot:status="slotData" >
        <el-switch  active-color="#13ce66" inactive-color="#ff4949" ></el-switch>
      </template>
      <template v-slot:operation="slotData" >
        <el-button type='danger' size="small" @click="handlerDel(slotData.data)" >删除</el-button>
        <el-button type='success' size="small" @click="handlerEdit(slotData.data)" >编辑</el-button>
      </template>
    </TableVue>
  </div>
</template>
<script>
import { reactive, ref, onMounted, computed } from "@vue/composition-api";
import SelectVue from "@/components/Select"
import TableVue from "@/components/Table"
export default {
  name:'iuserIndex',
  components:{ SelectVue, TableVue },
  setup( props, { root } ){
    const data = reactive({
      configOption: {
        init:['name','phone']
      },
      configTable:{
        selection:false,
        recordCheckbox: true,
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
        ]
      }
    })

    //方法=====================================
    const handlerDel = (params) => {
      console.log(params)
    }
    const handlerEdit = (params) => {
      console.log(params)
    }
    return {
      data,
      //fn
      handlerDel, handlerEdit
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