<template>
  <div>
    <el-dialog title="新增" :visible.sync="dialogVisible" width="700px" @close="close" @opened="openDialog" >
      <el-form :model="form" ref="addInfoForm" :rules="data.rules" >
        <el-form-item label="用户名：" :label-width="data.formLabelWidth"  prop='username'>
          <el-input v-model="form.username" placeholder="请输入邮箱" type='text'  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码：" :label-width="data.formLabelWidth" prop='password'>
          <el-input  type="password" v-model="form.password" placeholder="请输入6~20数字+字母" autocomplete="off" minlength="6" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="姓名：" :label-width="data.formLabelWidth" prop='truename'>
          <el-input v-model="form.truename" placeholder="请输入真实姓名" type='text'  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号：" :label-width="data.formLabelWidth" prop='phone'>
          <el-input v-model.number="form.phone" placeholder="请输入手机号" type='number'  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="地区：" :label-width="data.formLabelWidth" prop='region'>
          <CityPicker :cityPickerLevel="[]" :cityPickerData.sync='data.cityPickerData'></CityPicker>
        </el-form-item>
        <el-form-item label="是否启用：" :label-width="data.formLabelWidth" prop='status'>
          <el-radio v-model="form.status" label="1">禁用</el-radio>
          <el-radio v-model="form.status" label="2" >启用</el-radio>
        </el-form-item>
        <el-form-item label="角色：" :label-width="data.formLabelWidth" prop='role'>
          <el-checkbox-group v-model="form.role">
            <el-checkbox v-for="item in data.roleItem" :key="item.role" :label="item.role">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="按钮：" :label-width="data.formLabelWidth" >
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="danger"  :loading="data.submitLoading" @click="sumbitStr('addInfoForm')"  >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import sha1 from 'js-sha1';
import { reactive, ref, refs, watch, watchEffect, onBeforeMount } from "@vue/composition-api";
import { AddInfo, GetList, EditInfo } from "@/api/news"
import { formatDateTime } from "@/utils/validate"
import CityPicker from "@/components/CityPicker"
import { GetRole, UserAdd, UserEdit } from "@/api/user"
// 验证规则
import {stripscript,validateEmail,validatePass,VerificationCode} from '@/utils/validate'
export default {
  name: "dialofInfo",
  components: {CityPicker},
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    editData: {
      type:Object,
      default: () => {}
    },
    typeTitle: {
      type:Object,
      default: () => {}
    }
  },
  setup(props, { root, emit, refs }) {
    // 校验表单规则=======================
    // 验证用户名
    let validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'));
      }else if(validateEmail(value)) {
        callback(new Error('用户名格式有误'))
      } else {
        callback();
      }
    };
     // 密码验证
    let validatePassword = (rule, value, callback) => {
      // 过滤字符
      // console.log(stripscript(value))
      /**
       * 两种情况 
       * 1、编辑状态
       *  需要检验：form.id 存在，并且密码不为空时
       *  不需要检验：form.id存在，并且密码为空时
       * 2、添加状态
       *  需要检验：form.id不存在
       */
      
      // 不需要检验：form.id存在，并且密码为空时
      if(form.id && !value){
        callback()
      }
      if((form.id && value) || !form.id){
        
        if(value){
          form.password = stripscript(value)
          value = form.password
  
        }
  
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (validatePass(value)) {
          callback(new Error('密码为6至20位数字+字母'));
        } else {
          callback();
        }
      }
    };
    // =======基础数据类型====================================
    const dialogVisible = ref(false);
    // ========对象类型数据===================================
    const form = reactive({
        username:'',
        password:'',
        truename:'',
        phone:'',
        status: "1",
        // 角色列表
        role:[],
    })
    const data = reactive({
      formLabelWidth: '90px',
      // 省市区街道
      cityPickerData:{},
      roleItem:[],
      // 校验
      rules: reactive({
        username: [
            { validator: validateUsername, trigger: 'blur' }
        ],
        password: [
            { validator: validatePassword, trigger: 'blur' }
        ],
        role: [
            { required: true, message: "请选择角色", trigger: 'change' }
        ]
      })
      
    });
    
    
    
    //  获取角色
    const getRole = () => {
      GetRole().then(res => {
       data.roleItem = res.data.data
     })
    }  
    // 打开对话框
    const openDialog = () => {
      console.log(props.editData)
      let editData = props.editData
      // 如果存在id就是编辑
      if(editData.id){
        editData.role = editData.role.split(',')
        Object.assign(form ,editData)

      }else{ //添加
        // 把id删了
        form.id && delete form.id
      }
      console.log(form)
      getRole()
    }

   onBeforeMount( () => {
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
    
    // 重置表单
    const resetForm = () => {
      refs['addInfoForm'].resetFields()
      data.cityPickerData = {}
    }
    // 提交
    const sumbitStr = (params) => {
      refs[params].validate((valid) => {
        if(valid){
          const requestData = JSON.parse(JSON.stringify(form))
          // 角色的值转换成字符串
          requestData.role = requestData.role.join()
          // 地区的值
          requestData.region = JSON.stringify(data.cityPickerData)
          
          
          // 编辑状态：密码存在就加密，否则Delete删除
          if(requestData.id){
            if(requestData.password){
              requestData.password = sha1(requestData.password)
            }else {
              delete requestData.password
            }
            editAdd(requestData)
          }else{// 添加状态：密码需要加密，并且加密
            requestData.password = sha1(requestData.password)
            // 添加用户
            userAdd(requestData)
          }
        }else{
        }
      })
    }

    // 添加用户
    const userAdd = (params) => {
      UserAdd(params).then(res => {
        console.log(res)
        root.$message({
          message: res.data.message,
          type:"success"
        })
        close() 
        // 提交调用父组件的更新函数 更新table
        emit("refsTable")
      })
    }

   const editAdd = (params) => {
     UserEdit(params).then(res => {
       console.log(res)
       root.$message({
         message: res.data.message,
         type:'success'
       })
       close()
       // 提交调用父组件的更新函数 更新table
        emit("refsTable")
     })
   }
   
   
    // }
    return {
      dialogVisible,
      close,
      data,
      openDialog,
      sumbitStr,
      form
      // handleClose
    };
  }
};
</script>

<style lang="scss" >
</style>