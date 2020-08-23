<template>
  <div id="nav-wrap">
    <h1 class="logo">
      <img src="../../../assets/navLogo.png" alt="">
    </h1>
        <el-menu
          
          :default-active="defaultRouter"
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
          background-color = "transparent"
          text-color = '#fff'
          active-text-color	="#fff"
          router
        >
          <template v-for="(item, index) in routers"  >
            <el-submenu  v-if="!item.hidden"  :key='item.id' :index='index+""' >
              <template slot="title">
                <svg-icon :iconClass="item.meta.icon" :className="item.meta.icon" />
                <span>{{item.meta.name}}</span>
              </template>
              <template v-for="(subItem) in item.children" >
                <el-menu-item  v-if="!subItem.hidden" :key="subItem.id" :index="subItem.path">{{subItem.meta.name}}</el-menu-item>
              </template>
            </el-submenu>
          </template>
        </el-menu>
  </div>
</template>

<script>
import { reactive, ref, computed } from '@vue/composition-api'
export default {
  name:'navMenu',
  setup(props,{ root }){
    // 数据=========================================================================
    
    // 路由列表
    const routers = reactive(root.$router.options.routes)
    // 默认选中路由列表
    const defaultRouter = computed(()=>{
      const {path} = root.$route
      return path
    })
    // 监听导航栏缩放
    const isCollapse = computed (()=>{
      return root.$store.state.app.isCollapse
    }) 

    // ====================================================================
    // 函数
    // ====================================================================
    

    return {
      isCollapse,
      routers,
      defaultRouter
    }
  }
};
</script>

<style lang="scss">
  .el-menu {
  border: none;
}
</style>

<style lang="scss" scope>
#nav-wrap {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  background-color: #344a5f;
  width: $navMenu;
  z-index: 1;
  @include webkit(transition, all .3s ease 0s);
  svg {
    font-size: 20px;
    margin-right: 10px;
  }
}
.logo{
  text-align: center;
  img {
    margin: 28px auto 25px;
    width: 92px;
    @include webkit(transition, all .3s ease 0s);
  }
}
.open {
  #nav-wrap { width: $navMenu; }
}
.close {
  #nav-wrap { width: $navMenuMin; }
  .logo img { width: 60%; }
}

</style>