<template>
  <div id="indicator" :style="{marginTop: -content.length*16+48+'px'}">
    <div class="index" :class="{active: currentIndex == i}" v-for="(c, i) in content">{{c}}</div>
  </div>
</template>

<script>
  import {scrollEvent} from "../../main";
  export default{
    props:['content'],
    data(){
      return {
        currentIndex:0
      }
    },
    created(){
      scrollEvent.$on('scroll', (e)=>{
        this.currentIndex = Math.ceil(e.height/e.bot * (this.content.length-1))
      })
    },
    methods:{

    }
  }
</script>

<style scoped>
  #indicator{position: absolute;left:32px;top:50%;}
  @media (max-height: 500px){
    #indicator{display: none;}
  }
  .index{font:300 18px/32px Montserrat;color:#fff;pointer-events: none;}
  .active{font-weight: 900;font-size:24px;}
</style>
