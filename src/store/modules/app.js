
import { Login, Logout} from '@/api/login'
import { setToKen,removeToKen,removeUserName, setUserName, getUserName } from '../../utils/tokenMethods'
import { GetCategory } from '@/api/news'
const state  = {
  isCollapse: JSON.parse(sessionStorage.getItem("isCollapse")) || false,
  toKen :'',
  userName: getUserName() || '',
  qiniuUrl: 'http://www-web-jshtml-cn-idva7mx.web-jshtml.cn/'
}
const getters = {
  isCollapse : state => state.isCollapse,
  userName: state => state.userName,
  qiniuUrl: state => state.qiniuUrl
}
const mutations = {
  SET_COLLAPSE(state,value){
    state.isCollapse = !state.isCollapse
    sessionStorage.setItem("isCollapse",JSON.stringify(state.isCollapse))
  },
  SET_TOKEN(state,value){
    state.toKen = value
  },
  SET_USERNAME(state,value){
    state.userName = value
  }
}

const actions = {
  // async login(content,data){
    //   // console.log(data)
    //   // let data =  await Login(data)
    //   let res = await Login(data)
    //   console.log(res)
    //   return res
    // },
    // 登陆请求
    login({ commit },data){
      return new Promise((resolve,reject) => {
        Login(data).then(res=>{
          let data = res.data.data
          commit("SET_TOKEN",data.token)
          commit("SET_USERNAME",data.username)
          setToKen(data.token)
          setUserName(data.username)
          resolve(res)
        }).catch(err=>{
          reject(err)
        })
      })
    },
    // 点击退出按钮
    exit({ commit }){
      return new Promise((resolve,reject)=>{
          
          removeToKen()
          removeUserName()
          commit("SET_TOKEN","")
          commit("SET_USERNAME","")
          resolve()
      })
    },
  //获取分类
  getInfoCategory(content, repuestData) {
    return new Promise((resolve, reject) => {
        GetCategory({}).then((response) => {
            resolve(response.data.data.data)
        }).catch(error => {
            reject(error)
        })
    })
  },
}


export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}