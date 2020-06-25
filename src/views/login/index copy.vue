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

        <el-form-item prop="passwords" class="item-from" v-show="menuTab[1].current" >
          <label>重复密码</label>
          <el-input type="password" v-model="ruleForm.passwords" autocomplete="off" minlength="6" maxlength="20"></el-input>
        </el-form-item>

      <el-form-item  prop="code"  class='item-from'>
        <label for="">验证码</label>
        <el-row :gutter="10">
        <el-col :span="15"><el-input type='text' v-model.number="ruleForm.code"></el-input></el-col>
        <el-col :span="9"><el-button type="success" class="block" >获取验证码</el-button></el-col>
      </el-row>
        
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="submitForm('ruleForm')" class='login-btn block'>提交</el-button>
      </el-form-item>
    </el-form>
    </div>
  </div>
</template>

<script>
import {stripscript,validateEmail,validatePass,VerificationCode} from '@/utils/validate'
export default {
  
  data(){
      // 邮箱验证
      var validateUesrname = (rule, value, callback) => {
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
      var validatePassword = (rule, value, callback) => {
        
        // 过滤字符
        // console.log(stripscript(value))
        this.ruleForm.password = stripscript(value)
        value = this.ruleForm.password
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (validatePass(value)) {
          callback(new Error('密码为6至20位数字+字母'));
        } else {
          callback();
        }
      };
      // 第二次密码验证
      var validatePasswords = (rule, value, callback) => {
        // 如果是登陆界面 就直接通过验证 不需要在提交的时候验证
        console.log(this.menuTab[1].current)
        if(!this.menuTab[1].current) {
          callback() 
          console.log(123)
          } 
        // 过滤字符
        // console.log(stripscript(value))
        this.ruleForm.passwords = stripscript(value)
        value = this.ruleForm.passwords
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if ( value != this.ruleForm.password) {
          callback(new Error('重复密码不正确'));
        } else {
          callback();
        }
      };
      // 验证码
       var validateCode = (rule, value, callback) => {
         
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
    return {
      
      menuTab : [
        {txt:'登陆',current:true},
        {txt:'注册',current:false}
      ],
      //表单数据
      ruleForm: {
          username: '',
          password: '',
          passwords: '',
          code: ''
        },
        rules: {
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
        }
    }
  },
  methods:{
    toggleMemu(data){
      console.log(data)
      this.menuTab.forEach(item=>{
        item.current = false
      })

      data.current = true
    },

     submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
    
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