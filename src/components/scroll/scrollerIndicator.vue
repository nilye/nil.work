<template>
  <div id="indicator" :style="{marginTop: -projects.length*16+48+'px'}">
    <router-link class="index noselect"
                 v-for="(c, index) in projects"
                 :class="{active: currentIndex == index || currentIndex == c.id}"
                 :key="c.id"
                 :to="{name:'p', params:{id:c.id}}">
      {{c.label}}
    </router-link>
  </div>
</template>

<script>
  import {scrollEvent} from "../../main";
  export default{
    props:['projects'],
    data(){
      return {
        currentIndex:0
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
        if (route.path == '/'){
          scrollEvent.$on('scroll', (e)=>{
            this.currentIndex = Math.ceil(e.height/e.bot * (this.projects.length-1))
          })
        }
        if (route.path.match(/^\/p\/((?:[^\/]+?))(?:\/(?=$))?$/i)){
          this.currentIndex = route.params.id
        }
      }
    }
  }
</script>

<style scoped>
  #indicator{position:fixed;left:32px;top:50%;}
  @media (max-height: 500px){
    #indicator{display: none;}
  }
  .index{font:300 18px/32px Montserrat;display: block;}
  .index:hover {font-weight: 900;font-size:24px;}
  .active{font-weight: 900;font-size:24px;}
</style>
