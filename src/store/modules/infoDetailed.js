
const state  = {
  id:  sessionStorage.getItem('infoId') || "",
  title: "" || sessionStorage.getItem('infoTitle')
}
const getters = {
  infoId : (state) => {
    return state.id
  }
}
const mutations = {
  UPDATE_STATE_VALUE(state,params){
    for(let key in params){
      // 存储值
      state[key] = params[key].value

      // //存储到sessionStorage
      if(params[key].session) {
        sessionStorage.setItem(params[key].sessionKey, params[key].value);
    }
    }
  }
}

const actions = {
  
}


export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}