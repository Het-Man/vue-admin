<template>
  <div id='login' >
    <div class="login-wrap">
      <ul class='memu-tab'>
          <li :class="{'current':item.current}" v-for="(item, index) in menuTab" :key="index"  @click="toggleMemu(item)">{{item.txt}}</li>
      </ul>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm"  size="medium " class="demo-ruleForm login-from">

      <el-form-item  prop="username" class='item-from' >
        <label for="">邮箱</label>
        <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item prop="password" class="item-from">
          <label for="password">密码</label>
          <el-input id="password" type="password" v-model="ruleForm.password" autocomplete="off" minlength="6" maxlength="20"></el-input>
        </el-form-item>

        <el-form-item prop="passwords" class="item-from" v-show="model === 'register'" >
          <label>重复密码</label>
          <el-input type="password" v-model="ruleForm.passwords" autocomplete="off" minlength="6" maxlength="20"></el-input>
        </el-form-item>

      <el-form-item  prop="code"  class='item-from'>
        <label for="">验证码</label>
        <el-row :gutter="10">
        <el-col :span="15"><el-input type='text' v-model.number="ruleForm.code"></el-input></el-col>
        <el-col :span="9"><el-button type="success" class="block" @click='getCode()' >获取验证码</el-button></el-col>
      </el-row>
        
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="submitForm('ruleForm')" :disabled="btnLoginStatus"  class='login-btn block'>{{model ==='login'?'提交':'注册'}}</el-button>
      </el-form-item>
    </el-form>
    </div>
  </div>
</template>

<script>
import {stripscript,validateEmail,validatePass,VerificationCode} from '@/utils/validate'
// 引入3.0函数
import { reactive, ref, onMounted,refs } from '@vue/composition-api'
import {GetSms} from '@/api/login'
export default {
  name:'login',
  setup(props,context){
    // 这里面放置data数据，生命周期，自定义函数
    // reactive 声明对象引用类型的数据
    // ref 声明基础类型数据 取值 .value
    // isRef 判断是否是基础类型数据 
    //  toRefs 将引用类型的转换为基础数据类型
    // 邮箱验证
    let validateUesrname = (rule, value, callback) => {
      
      if (value === '') {
        callback(new Error('请输入用户名'));
      }else if(validateEmail(value)) {
        callback(new Error('用户名格式有误'))
      } else {
        // if (this.ruleForm.username !== '') {
        //   this.$refs.ruleForm.validateField('username');
        // }
        callback();
      }
    };
    // 密码验证
    let validatePassword = (rule, value, callback) => {
      
      // 过滤字符
      // console.log(stripscript(value))
      ruleForm.password = stripscript(value)
      value = ruleForm.password
      if (value === '') {
        callback(new Error('请输入密码'));
      } else if (validatePass(value)) {
        callback(new Error('密码为6至20位数字+字母'));
      } else {
        callback();
      }
    };
    // 第二次密码验证
    let validatePasswords = (rule, value, callback) => {
      // 如果是登陆界面 就直接通过验证 不需要在提交的时候验证
      
      if(model.value === 'login') {
        callback() 
        } 
      // 过滤字符
      // console.log(stripscript(value))
      ruleForm.passwords = stripscript(value)
      value = ruleForm.passwords
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if ( value != ruleForm.password) {
        callback(new Error('重复密码不正确'));
      } else {
        callback();
      }
    };
    // 验证码
    let validateCode = (rule, value, callback) => {
        
      if (!value) {
        return callback(new Error('验证码不能为空'));
      }else if (VerificationCode(value)){
        return callback(new Error('验证码格式有误'))
      }else {
        callback()
      }
      // setTimeout(() => {
      //   if (!Number.isInteger(value)) {
      //     callback(new Error('请输入数字值'));
      //   } else {
      //     if (value < 18) {
      //       callback(new Error('必须年满18岁'));
      //     } else {
      //       callback();
      //     }
      //   }
      // }, 1000);
    };
    const menuTab = reactive([
        {txt:'登陆',current:true,type:'login'},
        {txt:'注册',current:false,type:'register'}
      ])
    // 模块值 
      const model = ref('login');
    // 按钮初始化状态
    const btnLoginStatus = ref(true)
    //表单数据
    const ruleForm = reactive(
      {
        username: '',
        password: '',
        passwords: '',
        code: ''
      }
    ) 
    // 表单验证
    const rules = reactive({
      username: [
        { validator: validateUesrname, trigger: 'blur' }
      ],
      password: [
        { validator: validatePassword, trigger: 'blur' }
      ],
      passwords: [
        { validator: validatePasswords, trigger: 'blur' }
      ],
      code: [
        { validator: validateCode, trigger: 'blur' }
      ]
    })
    /* 
      声明函数
    */
    //登录注册切换  
    const toggleMemu = (data => {
      
      console.log(data)
      menuTab.forEach(item=>{
        item.current = false
      })
      // 高光
      data.current = true
      // 修改模块值
        model.value = data.type;
    })
    // 获取验证码
    const getCode = (()=>{
      if(!ruleForm.username){
        context.root.$message.error('请先输入邮箱');
        return false
      }
      if(validateEmail(ruleForm.username)){
        context.root.$message.error("邮箱格式有误")
        return false
      }
      let data = {
        username:ruleForm.username,
        module: 'register'
      }
      GetSms(data).then(res=>{
        console.log(res)
      }).catch(err=>{
        console.log(err)
      })
    })

    // 提交表单
    const submitForm = (formName => {
      context.refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    })

    // 生命周期
    onMounted(()=>{
    })


    return {
      menuTab,
      toggleMemu,
      submitForm,
      ruleForm,
      rules,
      getCode,
      model,
      btnLoginStatus
    }
  }
}
</script>

<style lang="scss" scope>
  #login{
    height: 100vh;
    background: #344a5f
  }
  .login-wrap{
    width: 330px;
    margin: auto;
    padding-top: 20px;
  }
  .memu-tab{
    text-align: center;
    li {
      display: inline-block;
      width: 88px;
      line-height: 36px;
      font-size: 14px;
      color: #fff;
      border-radius: 2px;
      cursor: pointer;
    }
    .current {
      background-color: rgba(0,0,0,.1)
    }
  }
  .login-from{
    margin-top: 29px;
    label {
      display: block;
      margin-bottom: 3px;
      font-size: 14px;
      color: #fff;
    }
    .item-from{
      margin-bottom: 13px;
    }
    .block {
      display: block;
      width: 100%;
    }
    .login-btn{
      margin-top: 19px;
    }
  }
</style>