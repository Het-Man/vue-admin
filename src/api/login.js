import service from '@/utils/request'

/* 
  获取验证码
*/
export function GetSms(data){
 return service.request({
    method:'post',
    url:'/getSms/',
    data
  })
} 

/* 
  注册
*/
export function Register(data){
  return service.request({
    method:'post',
    url:"/register/",
    data
  })
}

/* 
  登陆
*/

export function Login(data){
  // console.log(data)
  return service.request({
    method:'post',
    url:"/login/",
    data
  })
}
/* 
  退出登录
*/

export function Logout(data ={}){
  // console.log(data)
  return service.request({
    method:'post',
    url:"/logout/",
    data
  })
}