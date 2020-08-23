<template>
  <div id='main-wrap' >
    <div class="main-content">
      <div class="content">
        <!-- include  名称匹配的组件会缓存  exclude不会缓存 -->
        <keep-alive>
          
          <!-- <router-view  exclude='infoCategory'></router-view> -->
          <router-view v-if="$route.meta.keepAlive"></router-view>

        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  
}
</script>

<style lang="scss" scope>
  #main-wrap{
    height: 100vh;
  }
  .open {
    .main-content { padding-left: $navMenu + 30; }
  }
  .close {
    .main-content { padding-left: $navMenuMin + 30; }
  }
  .main-content{
    width: 100%;
    height: 100%;
    padding-top: $layoutHeader + 30;
    padding-right: 30px;
    @include webkit(box-sizing,border-box);
    @include webkit(transition, all .3s ease 0s);
  }
  .content {
    width: 100%;
    height: 100%;
    overflow: scroll;
    padding: 30px 30px 0 30px;
    background-color: #fff;
    @include webkit(box-sizing,border-box);
    &::-webkit-scrollbar {display:none}
  }

</style>