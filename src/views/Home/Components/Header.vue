<template>
  <div id='header-wrap'>
     头部
  </div>
</template>

<script>
export default {
  
}
</script>

<style lang="scss" scope>
  #header-wrap{
    position:fixed;
    left:$navMenu;
    top:0;
    height: 75px;
    // width: calc( 100% - 250px );
    right: 0;
    background-color: #fff;
    -webkit-box-shadow: 0 3px 16px 0 rgba(0,0,0,.1);
  }
</style>