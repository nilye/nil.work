import Scroller from './components/scroll/scroller.vue'
import ScrollerIndicator from './components/scroll/scrollerIndicator.vue'
import SideNav from './components/sideNav.vue'
import About from './components/about.vue'
import BackBtn from './components/backBtn.vue'
import { Projects } from './projects'
export default {
  name: 'App',
  data(){
    return{
      projects:Projects.reverse(),
      isAboutPage:false,
      isAnimating:false,
      activeProj:null
    }
  },
  created(){
    this.routeChanges(this.$route)
  },
  watch:{
    '$route'(to, from) {
      this.routeChanges(to)
    }
  },
  methods:{
    routeChanges(route) {
      if (route.path.match(/^\/p\/((?:[^\/]+?))(?:\/(?=$))?$/i)){
        this.activeProj = route.params.id
        setTimeout(()=>{
          window.scrollTo(0,0)
        },501)
      } else this.activeProj = null
      if (route.path == '/about') {
        window.scrollTo({top:0,left:0,behavior: 'smooth'})
        this.isAboutPage = true;
        document.body.className = 'unscrollable'
      } else{
        document.body.className = ''
      }
      if (route.path == '/') {
        this.isAboutPage = false;
      }
      this.isAnimating = true
      let that = this
      setTimeout(function () {
        that.isAnimating = false
      },501)
    }
  },
  components:{
    scroller:Scroller,
    scrollerIndicator:ScrollerIndicator,
    sideNav: SideNav,
    about:About,
    backBtn: BackBtn
  }
}
