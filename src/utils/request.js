import axios from 'axios'
import { Message } from "element-ui";
// import { reject } from 'core-js/fn/promise';
//http://www.web-jshtml.cn/dependenciesapi
//http://www.web-jshtml.cn/productapi

const BASEURL = process.env.NODE_ENV === 'production' ? '' : '/devApi'

const service = axios.create({
  baseURL: BASEURL,
  timeout: 1000,
  headers: {'X-Requested-With': 'XMLHttpRequest'},
})

service.defaults.headers.post['Content-Type'] = 'Content-Type:application/x-www-form-urlencoded; charset=UTF-8'

// 添加请求拦截器
service.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
service.interceptors.response.use(function (response) {

  // 对响应数据做点什么
  let data = response.data

  if(data.resCode !== 0){
    Message.error(data.message)
    return Promise.reject(data)
  }else {
    return response;
  }


  
 
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});




export default service