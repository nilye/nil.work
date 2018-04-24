<template>
  <div>
    <div class="img-cropper" v-for="(item, index) in 5" :style="position(index)">
      <img :src="image">
    </div>
  </div>
</template>

<script>

  export default {
    data(){
      return {
        image: null,
        windowHalf:window.innerWidth/2,
        ovalRadius:150
      }
    },
    created(){
      window.addEventListener('resize', this.windowOnReize)
    },
    methods:{
      windowOnReize(){
        this.windowHalf = window.innerWidth/2
      },
      position(i){
        console.log(i)
        let a = (this.ovalRadius*2)/Math.sqrt(3)-this.ovalRadius
        console.log(a)
        if(i % 2 == 0){
          return {right:this.windowHalf+'px', top: i*(150+a)+'px'}
        } else {
          return {left:this.windowHalf+'px', top: i*(150+a)+'px'}
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .img-cropper{position:absolute;width:300px;height:300px;border-radius: 50%;overflow: hidden;background: #fff;}
  img{width:100%;}
</style>
