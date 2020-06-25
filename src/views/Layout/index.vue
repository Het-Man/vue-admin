<template>
  <div id='home' :class='[isCollapse ? "close" : "open"]'>
    <HomeHeader />
    <HomeMain />
    <HomeNav />
  </div>
</template>

<script>
import HomeHeader from './Components/Header'
import HomeMain from './Components/Main'
import HomeNav from './Components/Nav'
import { computed } from '@vue/composition-api'
export default {
  name:'Home',
  components:{
    HomeHeader,
    HomeMain,
    HomeNav
  },
  setup(props,{root}){
    const isCollapse = computed(() => root.$store.state.app.isCollapse)
    return {
      isCollapse
    }
  }
}
</script>

<style lang="scss" scope>
  #home {
    height: 100%;
  }
</style>