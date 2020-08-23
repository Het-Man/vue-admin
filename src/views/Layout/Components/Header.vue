<template>
  <div id='header-wrap'>
    <div class='pull-left header-icon' @click='navMenuState' ><svg-icon iconClass='menu' className='menu' ></svg-icon></div>
    <div class='pull-right' >
      <div class='user-info pull-left' >
        <img src='../../../assets/face.jpg'>
        {{userName}}
      </div>
      <div class='pull-left header-icon'  @click='exit' >
        <svg-icon iconClass='exit' className='exit' />
      </div>
      
    </div>
  </div>
</template>

<script>
import { computed } from '@vue/composition-api'
export default {
  name:'layoutHeader',
  setup(props,{root}){
    // 获取用户名
    const userName = computed(()=>{
      return root.$store.state.app.userName
    })
    // 点击伸缩导航栏
    const navMenuState = ()=>{
      root.$store.commit('app/SET_COLLAPSE')
      // root.$store.commit('SET_COLLAPSE')
    }
    // 退出登录按钮
    const exit  = () => {
      root.$store.dispatch("app/exit").then(res=>{
          root.$message({
            message: "退出成功！",
            type:'success'
          })

          root.$router.push({
            name:'/login'
          })
      })
    }
    return {
      navMenuState,
      userName,
      exit
    }
  }
}
</script>

<style lang="scss" scope>
  #header-wrap{
    position:fixed;
    left:$navMenu;
    top:0;
    height: 75px;
    line-height: 75px;
    // width: calc( 100% - 250px );
    z-index: 1;
    right: 0;
    background-color: #fff;
    @include webkit(box-shadow, 0 3px 16px 0 rgba(0,0,0,.1));
    @include webkit(transition, all .3s ease 0s);
  }
  .open {
    #header-wrap { left: $navMenu; }
  }
  .close {
    #header-wrap { left: $navMenuMin; }
  }
  .header-icon {
    padding: 0 32px;
    svg {
      margin-bottom: -8px;
      font-size: 25px;
      cursor: pointer;
    }
  }
  .user-info {
    height: 100%;
    padding: 0 32px;
    border-right: 1px solid #ededed;
    + .header-icon {
      padding: 0 28px;
    }
    img {
      display: inline-block;
      margin-bottom: -12px;
      margin-right: 18px;
      border-radius: 50px;
    }
  }

 
</style>