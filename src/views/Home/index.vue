<template>
  <div id='home'>
    <HomeHeader />
    <HomeMain />
    <HomeNav />
  </div>
</template>

<script>
import HomeHeader from './Components/Header'
import HomeMain from './Components/Main'
import HomeNav from './Components/Nav'
export default {
  name:'Home',
  components:{
    HomeHeader,
    HomeMain,
    HomeNav
  },
  setup(props,context){

  }
}
</script>

<style lang="scss" scope>
  #home {
    height: 100%;
  }
</style>