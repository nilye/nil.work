<template>
  <div id="app">
    <div id="logo">
      <h1>NIL</h1>
      <h1>WO</h1>
      <h1>RK</h1>
    </div>
    <scroller></scroller>
    <router-view/>
  </div>
</template>

<script>
  import Scroll from './components/scroll/scroller.vue'
export default {
  name: 'App',
  components:{
    scroller:Scroll
  }
}
</script>

<style lang="scss">
  @font-face{font-family:Montserrat;font-weight:100;src:local("assets/font/Montserrat-Thin.tff")}
  @font-face{font-family:Montserrat;font-weight:200;src:local("assets/font/Montserrat-ExtraLight.tff")}
  @font-face{font-family:Montserrat;font-weight:300;src:local("assets/font/Montserrat-Light.tff")}
  @font-face{font-family:Montserrat;font-weight:400;src:local("assets/font/Montserrat-Regular.tff")}
  @font-face{font-family:Montserrat;font-weight:500;src:local("assets/font/Montserrat-Medium.tff")}
  @font-face{font-family:Montserrat;font-weight:600;src:local("assets/font/Montserrat-SemiBold.tff")}
  @font-face{font-family:Montserrat;font-weight:700;src:local("assets/font/Montserrat-Bold.tff")}
  @font-face{font-family:Montserrat;font-weight:800;src:local("assets/font/Montserrat-ExtraBold.tff")}
  @font-face{font-family:Montserrat;font-weight:900;src:local("assets/font/Montserrat-Black.tff")}
  body{background:#333;margin:0;-webkit-font-smoothing:antialiased}
  #logo{top:32px;left:32px;position:absolute}
  #logo h1{font:600 28px/32px Montserrat;color:#fff;margin:0}
</style>
