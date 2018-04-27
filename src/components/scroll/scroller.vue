<template>
  <div id="scroll-wrap" :style="{marginLeft: - this.ovalRadius*2+'px', top: scroll.height-scroll.base+'px'}">
    <div class="img-cropper" v-for="(item, index) in content" :style="[position(index),size]" >
      <img :src="image">
    </div>
  </div>
</template>

<script>
  import { scrollEvent } from "../../main";

  export default {
    props:['content'],
    data(){
      return {
        image: null,
        windowHalf:window.innerWidth/2,
        ovalRadius:150,
        scroll:{
          height: 0,
          base: 0,
          bot: 500
        }
      }
    },
    created(){
      this.windowOnResize()
      window.addEventListener('resize', this.windowOnResize)
      window.addEventListener('mousewheel', this.onScroll)
    },
    computed:{
      size(){
        return {width:this.ovalRadius*2+'px',height:this.ovalRadius*2+'px'}
      },
      gap(){
        return (this.ovalRadius*2)/Math.sqrt(3)-this.ovalRadius
      }
    },
    methods:{
      windowOnResize(){
        this.windowHalf = window.innerWidth/2
        if (window.innerWidth >= 1440) this.ovalRadius = 270
        else if (window.innerWidth >= 1280) this.ovalRadius = 240
        else if (window.innerWidth >= 960) this.ovalRadius = 180
        else if (window.innerWidth >= 600) this.ovalRadius = 112
        else this.ovalRadius = 60
        this.scroll.base = -this.gap
        this.scroll.bot = window.innerHeight - (this.content.length+1)*(this.ovalRadius+this.gap)
      },
      position(i){
        if(i % 2 == 0){
          return {left:0+'px', top: i*(this.ovalRadius+this.gap)+'px'}
        } else {
          return {left:this.ovalRadius*2+'px', top: i*(this.ovalRadius+this.gap)+'px'}
        }
      },
      onScroll(e){
        this.scroll.height -= e.deltaY
        if (this.scroll.height > 0) this.scroll.height = 0
        if (this.scroll.height < this.scroll.bot) this.scroll.height = this.scroll.bot
        scrollEvent.$emit('scroll', this.scroll)
      }
    }
  }
</script>

<style lang="scss" scoped>
  #scroll-wrap{position: absolute;left: 50%;transition: 0.2s top ease-in-out}
  .img-cropper{position:absolute;width:300px;height:300px;border-radius: 50%;overflow: hidden;background: #fff;}
  img{width:100%;}
</style>
