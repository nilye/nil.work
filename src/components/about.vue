<template>
    <div class="about">
      <div class="about-wrap">
        <div class="portrait">
          <img src="../../static/img/portrait.jpg">
        </div>
        <div class="bio">
          <h1>叶欣洲 <span>NIL</span></h1>
          <p>Front-End Engineer × UX/UI Designer</p>
          <p>Founder of Commatube</p>
          <p>School of Visual Arts × Interactive Design</p>
          <p>Pasta & Succulent Maniac</p>
        </div>
      </div>
      <div class="about-website">nil.work is built with
        <img src="/index/static/img/icons/vue.png" style="height: 18px;margin-bottom: -4px;"/>
        Vue.js</div>
    </div>
</template>

<script>
  import VanillaTilt from "vanilla-tilt";
  export default {
    mounted(){
      VanillaTilt.init(document.querySelector('.portrait img'),{})
    },
    methods:{
    }
  }
</script>

<style lang="scss" scoped>
  @import "../styles.scss";
  .about{position:absolute;left:50%;top:50%;transform: translate(-50%, -50%);transition:0.5s ease-in-out;}
  .about-wrap{display:flex;flex-direction: row-reverse;min-width:222px;white-space: nowrap;}
  .bio{flex:1;margin-bottom: 32px;}
  .portrait{width:200px;height: 200px;margin-left: 80px;border-radius: 50%;}
  .portrait img{position:absolute;top:50%;margin-top:-100px;width:200px;height: 200px;border-radius: 50%;@include shadow(5)}
  .about-website{position: absolute;bottom: -120px;margin-left: -110px;left: 50%;}
  @media (max-width:960px){
    .about{width: calc(100vw - 160px);margin-left:16px;}
    .about-wrap{display: block;flex-direction: column;}
    .portrait{margin-left:0;}
    .portrait img{top:0;margin-top:0;position: relative;}
    .bio p{font-size:13px;}
    .about-website{bottom: -80px;font-size:11px;}
  }
  h1{font-weight: 600;font-size: 48px;}
  h1 span{font-family: Raleway;}
  p{font-size:18px;margin:12px 0;}

</style>
