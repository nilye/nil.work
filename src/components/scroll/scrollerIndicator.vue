<template>
  <div id="indicator" v-if="show" :style="{marginTop: -content.length*16+48+'px'}">
    <div class="index" :class="{active: currentIndex == i}" v-for="(c, i) in content">{{c}}</div>
  </div>
</template>

<script>
  import {scrollEvent} from "../../main";

  export default{
    props:['content'],
    data(){
      return {
        show:true,
        currentIndex:0
      }
    },
    created(){
      scrollEvent.$on('scroll', (e)=>{
        this.currentIndex = Math.ceil(e.height/e.bot * (this.content.length-1))
        console.log(e.height/e.bot * this.content.length)
      })
      window.addEventListener('resize', this.toShow)
    },
    methods:{
      toShow(){
        this.show = window.innerHeight > 500 ? true : false
      }
    }
  }
</script>

<style scoped>
  #indicator{position: absolute;left:32px;top:50%;}
  .index{font:300 18px/32px Montserrat;color:#fff;}
  .active{font-weight: 900;font-size:24px;}
</style>
