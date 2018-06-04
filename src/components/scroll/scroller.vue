<template>
  <!--<div id="scroll-wrap" :style="{top: scroll.height-scroll.base+'px'}">-->
  <div id="scroll-wrap">
    <router-link class="tn"
                 v-for="(item, index) in projects"
                 :key="item.id"
                 :to="{name:'p', params:{id:item.id}}"
                 :style="[position(index,item.id),size]"
                 :class="{active: activeProj == item.id,
                 deactive: (activeProj != item.id && activeProj != null),
                 isAnimating:(activeProj == item.id && tnIsAnimating)
                 }">
      <div class="tn-title">{{item.name}}</div>
      <img :src="thumbnail(item.id)" >
    </router-link>
  </div>
</template>

<script>
  import { scrollEvent } from "../../main";
  import VanillaTilt from "vanilla-tilt";
  import Projects from "../../projects"
  export default {
    props:['projects','activeProj'],
    data(){
      return {
        image: null,
        windowHalf:window.innerWidth/2,
        tnRadius:150,
        tnTitle:null,
        tnIsAnimating:false,
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
    mounted(){
      VanillaTilt.init(document.querySelectorAll('.tn'),{
        max: 30,
        scale: 1.1,
        speed: 300,
        transition:true,
        easing: 'cubic-bezier(0,0,.5,1)'
      })
    },
    watch:{
      '$route'(to, from) {
        if (to.path.match(/^\/p\/((?:[^\/]+?))(?:\/(?=$))?$/i)){
          this.tnIsAnimating = true
          setTimeout(()=>{
            this.tnIsAnimating = false
          },550)
        }
      }
    },
    computed:{
      size(){
        return {width:this.tnRadius*2+'px',height:this.tnRadius*2+'px'}
      },
      gap(){
        // return (this.tnRadius*3)/Math.sqrt(3)-this.tnRadius
        return this.tnRadius/2
      }
    },
    methods:{
      windowOnResize(){
        this.windowHalf = window.innerWidth/2
        if (window.innerWidth >= 1440) this.tnRadius = 160
        else if (window.innerWidth >= 960) this.tnRadius = 132
        else if (window.innerWidth >= 600) this.tnRadius = 88
        else this.tnRadius = 64
        this.scroll.base = -32
        this.scroll.height = 0
        this.scroll.bot = window.innerHeight - (this.projects.length+1)*(this.tnRadius+this.gap)
      },
      position(index,id){
        let gapV = (this.tnRadius+this.tnRadius/2)*Math.sqrt(3)*0.5 - this.tnRadius
        if (this.activeProj == id){
          return {left:'50%',top:'72px'}
        } else {
          if(index % 2 == 0){
            return {left:(this.windowHalf-this.tnRadius*2 - gapV)+'px', top: (index+0.5)*(this.tnRadius+this.gap)+'px'}
          } else {
            return {left:(this.windowHalf+gapV) + 'px', top: (index+0.5) * (this.tnRadius + this.gap) + 'px'}
          }
        }
      },
      thumbnail(id) {return Projects.thumbnail(id)},
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
  @import "../../styles.scss";
  #scroll-wrap{position: absolute;left: 0;top:0;width:100%;transition:0.5s ease-in-out;}
  .tn{position:absolute;width:300px;height:300px;border-radius:50%;background: #dfdfdf;transition:all 0.4s cubic-bezier(0,0,.5,1);    margin-bottom: 104px;}
  .tn-title{position: absolute;left:50%;top:calc( 100% + 18px );transform:translateX(-50%);font:600 16px/24px Raleway;opacity: 0;transition: 0.2s;pointer-events: none;width: 100%;text-align: center;}
  @media (max-width: 960px){
    .tn-title{font:500 12px/12px Raleway;}
  }
  .tn img{width: 100%;height: 100%;border-radius:50%;object-fit: cover;left:0;top:0;position: absolute;@include shadow(2);transition:0.3s cubic-bezier(0,0,.4,1)}
  /*.tn:hover{transform: scale(1.15);}*/
  .tn:hover .tn-title{opacity: 1;}
  .tn:hover img{@include shadow(5);}
  .isAnimating{position:fixed !important;}
  .active{width:calc( 100vw - 208px ) !important;max-width:960px;border-radius:0 !important;pointer-events: none;transform: scale(1) translateX(-50%) !important;opacity: 1!important;}
  .active img{width:100% !important;height: auto !important;border-radius: 0 !important;z-index: 1;box-shadow:none;}
  .deactive{opacity: 0;transform: scale(0.8);z-index: -1;pointer-events: none;}
  //.active{left:-50vw !important;top:-50vw !important;width:200vw !important;height: 200vh !important;}
</style>
