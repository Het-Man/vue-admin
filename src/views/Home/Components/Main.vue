<template>
  <div id='main-wrap' >
    内容
  </div>
</template>

<script>
export default {
  
}
</script>

<style lang="scss" scope>
  #main-wrap{
    // box-sizing: border-box;
    // height: calc( 100% - 75px );
    // // height: 100%;
    // width: calc( 100% - 280px );
    // margin: 75px 0 0 280px; 
    // // border: 30px solid #f7f7f7;
    // background-color: #fff;
    // -webkit-box-sizing: border;

    position:fixed;
    left: $navMenu;
    top: 75px;
    right: 0;
    bottom: 0;
    border: 30px solid #f7f7f7;
    border-bottom: none;
    background-color: #fff;
  }
</style>