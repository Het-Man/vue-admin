<template>
  <div id='login' >
    <div class="login-wrap">
      <ul class='memu-tab'>
          <li :class="{'current':item.current}" v-for="(item, index) in menuTab" :key="index"  @click="toggleMenu(item)">{{item.txt}}</li>
      </ul>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="logindata"  size="medium " class="demo-ruleForm login-from">

      <el-form-item  prop="username" class='item-from' >
        <label for="username">邮箱</label>
        <el-input id="username" type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item prop="password" class="item-from">
          <label for="password">密码</label>
          <el-input id="password" type="password" v-model="ruleForm.password" autocomplete="off" minlength="6" maxlength="20"></el-input>
        </el-form-item>

        <el-form-item prop="passwords" class="item-from" v-show="model === 'register'" >
          <label for='passwords' >重复密码</label>
          <el-input id="passwords" type="password" v-model="ruleForm.passwords" autocomplete="off" minlength="6" maxlength="20"></el-input>
        </el-form-item>

      <el-form-item  prop="code"  class='item-from'>
        <label for="code">验证码</label>
        <el-row :gutter="10">
        <el-col :span="15"><el-input id="code"  type='text' v-model="ruleForm.code"></el-input></el-col>
        <el-col :span="9"><el-button type="success" class="block" @click='getCode()' :disabled="btnCodeStatus.status" >{{btnCodeStatus.text}}</el-button></el-col>
      </el-row>
        
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="submitForm('logindata')" :disabled="btnLoginStatus"  class='login-btn block'>{{model ==='login'?'提交':'注册'}}</el-button>
      </el-form-item>
    </el-form>
    </div>
  </div>
</template>

<script>
import sha1 from 'js-sha1'
import {stripscript,validateEmail,validatePass,VerificationCode} from '@/utils/validate'
// 引入3.0函数
import { reactive, ref, onMounted,refs } from '@vue/composition-api'
// 接口
import {GetSms, Register, Login} from '@/api/login'
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
    //===============================================================================================
    // 声明数据
    // ==============================================================================================
    // 模块值 
    const model = ref('login');
    // 按钮初始化状态
    const btnLoginStatus = ref(true)
    // 倒计时id
    const timeId = ref('')
    // 标题切换
    const menuTab = reactive([
        {txt:'登陆',current:true,type:'login'},
        {txt:'注册',current:false,type:'register'}
      ])
    // 验证码按钮初始化状态
    const btnCodeStatus = reactive({
      status:false,
      text:'获取验证码'
    })
    //表单数据
    const ruleForm = reactive(
      {
        username: 'hong321@qq.com',
        password: '586878qwe',
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
   // ==============================================================================================================
    /* 
      声明函数
    */
    //登录注册切换  
    const toggleMenu = (data => {
      menuTab.forEach(item=>{
        item.current = false
      })
      // 高光
      data.current = true
      // 修改模块值
      model.value = data.type;
      resetFromData()
      // 重置验证码按钮
      clearCountDown()
    })
    
    // 清除表单数据
    const resetFromData = (()=>{
      // 重置表单
      context.refs.logindata.resetFields()
    })
    // 更新验证码按钮状态
    const updataBtnStatus = ((params)=>{
      btnCodeStatus.status = params.status
      btnCodeStatus.text = params.text
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
        module: model.value
      }
      // 修改验证码按钮状态
      updataBtnStatus({
        status:true,
        text:'发送中'
      })
      
      GetSms(data).then(res=>{
        console.log(res)
        
        context.root.$message({
          message:res.data.message,
          type:'success'
        })
        btnLoginStatus.value = false
        countDown(60)
      }).catch(err=>{
        console.log(err)
      })

    })

    /* 
      倒计时
    */
    const countDown = ((time)=>{
      let timer = time
      // console.log(timeId.value)
      if(timeId.value){clearInterval(timeId.value)}
      timeId.value = setInterval(()=>{
        timer--
        if(timer === 0){
          clearInterval(timeId.value)
          updataBtnStatus({
            status:false,
            text:'再次获取'
          })
        }else{
          btnCodeStatus.text = `倒计时${timer}秒`
        }
        
      },1000)
    })

    // 清除倒计时
    const clearCountDown = (()=>{
      // 还原验证码按钮状态
      updataBtnStatus({
        status:false,
        text:'验证码'
      })
      // 清楚倒计时
      clearInterval(timeId.value)
    })
    // 提交表单
    const submitForm = (formName => {     
      context.refs[formName].validate((valid) => {
        if (valid) {
          // alert('submit!');
          // 根据模块的值调用对应的接口
          model.value == 'login' ? login() : register()
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    })
    // 登录
    const login = (() => {
      let data = {
        username:ruleForm.username,
        password:sha1(ruleForm.password),
        code:ruleForm.code
      }
      console.log(data)
      Login(data).then(res=>{
        console.log(res)
        if(res.data.resCode === 0) {
          context.root.$router.push({name:'Home'})
        }
      }).catch(err=>{
        console.log(err)
      })
    })
    // 注册
    const register  = (() =>{
       let data  = {
        username:ruleForm.username,
        password:sha1(ruleForm.password),
        code:ruleForm.code
      }
      Register(data).then(res=>{
        console.log(res)
        
        context.root.$message({
          message: res.data.message,
          type: 'success'
        })
        // 注册成功切回登录
        toggleMenu(menuTab[0])
        // 清除定时器还原验证码按钮状态
        clearCountDown()
      })
    })

    // 生命周期
    onMounted(()=>{
    })


    return {
      menuTab,
      toggleMenu,
      submitForm,
      ruleForm,
      rules,
      getCode,
      model,
      btnLoginStatus,
      btnCodeStatus,
      timeId
    }
  }
}
</script>

<style lang="scss" scope>
  #login{
    height: 100%;
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