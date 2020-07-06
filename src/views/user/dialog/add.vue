<template>
  <div>
    <el-dialog title="新增" :visible.sync="dialogVisible" width="700px" @close="close" @opened="openDialog" >
      <el-form :model="data" ref="addInfoForm">
        <el-form-item label="用户名：" :label-width="data.formLabelWidth">
          <el-input v-model="data.form.email" placeholder="请输入邮箱" type='text'  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码：" :label-width="data.formLabelWidth" prop='title'>
          <el-input v-model="data.form.title" placeholder="请输入6~20数字+字母" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名：" :label-width="data.formLabelWidth" prop='email'>
          <el-input v-model="data.form.email" placeholder="请输入真实姓名" type='text'  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号：" :label-width="data.formLabelWidth" prop='email'>
          <el-input v-model="data.form.email" placeholder="请输入手机号" type='text'  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="地区：" :label-width="data.formLabelWidth" prop='email'>
          <CityPicker :cityPickerLevel="[]" :cityPickerData.sync='data.cityPickerData'></CityPicker>
          {{data.cityPickerData}}
        </el-form-item>
        <el-form-item label="是否启用：" :label-width="data.formLabelWidth" prop='email'>
          <el-radio v-model="data.form.status" label="1">禁用</el-radio>
          <el-radio v-model="data.form.status" label="2" >启用</el-radio>
        </el-form-item>
        <el-form-item label="角色：" :label-width="data.formLabelWidth" prop='email'>
          <el-checkbox-group v-model="data.form.role">
            <el-checkbox v-for="item in data.form.roleItem" :key="item.role" :label="item.role">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="按钮：" :label-width="data.formLabelWidth" prop='email'>
          <el-input v-model="data.form.email" placeholder="请输入内容" type='text'  autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="danger"  :loading="data.submitLoading"  >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, ref, refs, watch, watchEffect, onBeforeMount } from "@vue/composition-api";
import { AddInfo, GetList, EditInfo } from "@/api/news"
import { formatDateTime } from "@/utils/validate"
import CityPicker from "@/components/CityPicker"
import {GetRole} from "@/api/user"
export default {
  name: "dialofInfo",
  components: {CityPicker},
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    category: {
      type:Array,
      default: () => []
    },
    typeTitle: {
      type:Object,
      default: () => {}
    }
  },
  setup(props, { root, emit, refs }) {
    // =======基础数据类型====================================
    const dialogVisible = ref(false);
    // ========对象类型数据===================================
    const data = reactive({
      formLabelWidth: '90px',
      form:{
        email:'',
        status: "2",
        // 角色列表
        role:["A","B"],
        roleItem: "",
      },
      // 省市区街道
      cityPickerData:{}
    });

    //  获取角色
    const getRole = () => {
      GetRole().then(res => {
       console.log(res.data.data)
       data.form.roleItem = res.data.data
       console.log(data.form.roleItem)
     })
    }  
    // 打开对话框
    const openDialog = () => {
      getRole()
    }

   onBeforeMount( () => {
     openDialog()
   })
    // 监听传参如果父组件传值就赋值给弹出框的状态
    watchEffect(() => dialogVisible.value = props.flag);
    //=======================函数方法声明======================
    // 关闭弹出框的回调
    const close = () => {
      // 把自己弹出关闭
      dialogVisible.value = false;
      // 传给父组件
      // 使用修饰器方式提交 父组件只需加上.sync 这样父组件就用在监听属性了 直接可以修改
      emit("update:flag", false);
      resetForm()
    };
    // 打开对话框
    // const openDialog = () => {
    //   data.categoryOption = props.category
    //   if(props.typeTitle.title == '编辑'){
    //     let requestData = {
    //       id: props.typeTitle.id,
    //       pageNumber: 1,
    //       pageSize: 1,
    //     }
    //     GetList(requestData).then(res => {
    //       console.log(res)
    //       let resdata = res.data.data.data[0]
    //       data.form  = {
    //         category: resdata.categoryId,
    //         title: resdata.title,
    //         content: resdata.content
    //       }
    //     }).catch(err => {})
    //   }
    // }
    // 重置表单
    const resetForm = () => {
      // refs.addInfoForm.resetFields()
      data.form.email = ''
    }
    // 提交
    // const sumbitStr = () => {
    //   if(props.typeTitle.title == '新增'){
    //     interFace(AddInfo)
    //   }else if(props.typeTitle.title == '编辑'){
    //     interFace(EditInfo)
    //   }

    // }
    /* 
      新增或者编辑接口
      interFaceName : 接口名
    */
    // const interFace = (interfaceName) => {
    //    // 获取时间
    //     let dateTime = formatDateTime(new Date())

    //     let requestData = {
    //       categoryId: data.form.category ,
    //       title: data.form.title,
    //       imgUrl: "",
    //       createDate: dateTime,
    //       content: data.form.content,
    //     }
    //     // 判断是编辑还是新增 编辑就给请求参数加上id
    //     if(props.typeTitle.title == '编辑'){
    //       requestData.id = props.typeTitle.id
    //     }else {
    //       delete requestData.id
    //     }
    //     if(!data.form.category ){
    //       root.$message({
    //         message: '分类不能为空！',
    //         type: 'error'
    //       })
    //       return false
    //     }else if(!data.form.title){
    //       root.$message({
    //         message: '标题不能为空！',
    //         type: 'error'
    //       })
    //       return false
    //     }
    //     data.submitLoading = true
    //     // 接口
    //     interfaceName(requestData).then( res => {
    //       console.log(res)
    //       dialogVisible.value = false
    //       root.$message({
    //         message:res.data.message,
    //         type:'success'
    //       })
    //       emit('getListEmit')
    //       data.submitLoading = false
    //     }).catch(err => {})

    // }
    // // 编辑信息
    // const editInfo = () => {
    //   let dateTime = formatDateTime(new Date())
    //   let request = {
    //     id: props.typeTitle.id,
    //     categoryId: data.form.category ,
    //     title: data.form.title,
    //     imgUrl: "",
    //     createDate: dateTime,
    //     content: data.form.content,
    //   }
    //   EditInfo(request).then(res => {
    //     console.log(res)
    //     // dialogVisible.value = false
    //   })
    // }
    return {
      dialogVisible,
      close,
      data,
      openDialog,
      // sumbitStr,
      // handleClose
    };
  }
};
</script>

<style lang="scss" >
</style>