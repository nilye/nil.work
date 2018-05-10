<template>
  <div id="app">
    <div id="logo">
      <h1>NIL</h1>
      <h1>WO</h1>
      <h1>RK</h1>
    </div>
    <scroller :content="content"></scroller>
    <scroller-indicator :content="content"></scroller-indicator>
    <side-nav></side-nav>
    <router-view></router-view>
  </div>
</template>

<script>
import Scroller from './components/scroll/scroller.vue'
import ScrollerIndicator from './components/scroll/scrollerIndicator.vue'
import SideNav from './components/sideNav.vue'
export default {
  name: 'App',
  data(){
    return{
      content:[1,2,3,4,5,7,3,5,2]
    }
  },
  methods:{

  },
  components:{
    scroller:Scroller,
    scrollerIndicator:ScrollerIndicator,
    sideNav: SideNav
  }
}
</script>

<style lang="scss">
  @import "../static/font/MaterialIcons/material-icons.css";
  .material-icons{color:#fff;}
  @font-face{font-family:Montserrat;font-weight:100;src:local("../static/font/Montserrat/Montserrat-Thin.tff")}
  @font-face{font-family:Montserrat;font-weight:200;src:local("../static/font/Montserrat/Montserrat-ExtraLight.tff")}
  @font-face{font-family:Montserrat;font-weight:300;src:local("../static/font/Montserrat/Montserrat-Light.tff")}
  @font-face{font-family:Montserrat;font-weight:400;src:local("../static/font/Montserrat/Montserrat-Regular.tff")}
  @font-face{font-family:Montserrat;font-weight:500;src:local("../static/font/Montserrat/Montserrat-Medium.tff")}
  @font-face{font-family:Montserrat;font-weight:600;src:local("../static/font/Montserrat/Montserrat-SemiBold.tff")}
  @font-face{font-family:Montserrat;font-weight:700;src:local("../static/font/Montserrat/Montserrat-Bold.tff")}
  @font-face{font-family:Montserrat;font-weight:800;src:local("../static/font/Montserrat/Montserrat-ExtraBold.tff")}
  @font-face{font-family:Montserrat;font-weight:900;src:local("../static/font/Montserrat/Montserrat-Black.tff")}
  @font-face{font-family:Noto Sans SC;font-weight:100;src:url("../static/font/NotoSansSC/NotoSansSC-Thin.otf")}
  @font-face{font-family:Noto Sans SC;font-weight:200;src:url("../static/font/NotoSansSC/NotoSansSC-Light.otf")}
  @font-face{font-family:Noto Sans SC;font-weight:300;src:url("../static/font/NotoSansSC/NotoSansSC-DemiLight.otf")}
  @font-face{font-family:Noto Sans SC;font-weight:400;src:url("../static/font/NotoSansSC/NotoSansSC-Regular.otf")}
  @font-face{font-family:Noto Sans SC;font-weight:500;src:url("../static/font/NotoSansSC/NotoSansSC-Medium.otf")}
  @font-face{font-family:Noto Sans SC;font-weight:600;src:url("../static/font/NotoSansSC/NotoSansSC-Bold.otf")}
  @font-face{font-family:Noto Sans SC;font-weight:700;src:url("../static/font/NotoSansSC/NotoSansSC-Black.otf")}
  body{background:#333;margin:0;-webkit-font-smoothing:antialiased;overflow: hidden;}
  #logo{top:32px;left:32px;position:absolute}
  #logo h1{font:600 28px/32px Montserrat;color:#fff;margin:0}
</style>
