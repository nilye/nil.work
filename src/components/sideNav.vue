<template>
  <div id="side-nav" class="noselect">
    <router-link class="icon" v-if="isAboutPage" to="/">
      <i class="material-icons">close</i>
    </router-link>
    <router-link class="icon"v-if="!isAboutPage" to="/about">
      <i class="material-icons">account_circle</i>
    </router-link>
    <a class="icon" target="_blank" href="mailto:entaroalsace@gmail.com?subject=From Nil.work">
      <i class="material-icons">email</i>
    </a>
    <a class="icon" target="_blank" href="http://commatube.com">
      <img src="/index/static/img/icons/commatube_logo.png" style="filter:grayscale(100%)">
    </a>
  </div>
</template>

<script>
  export default {
    name: 'sideNav',
    data(){
      return {
        isAboutPage:false
      }
    },
    created(){
      if (this.$route.path == '/about') this.isAboutPage = true
      else this.isAboutPage = false
    },
    watch:{
      '$route'(to, from) {
        if (to.path == '/about') this.isAboutPage = true
        else this.isAboutPage = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  #side-nav{display: flex;flex-direction: column;position:fixed;right: 32px;top: 50%;margin-top: -52px;}
  .icon{margin: 12px 0;text-align: right;display: flex;justify-content: flex-end;cursor: pointer;transition: 0.2s ease-in-out;}
  .icon img{height: 32px;width: 32px;}
  /*.icon:hover .tool-tip{display: block}*/
  /*.tool-tip{color:#fff;font: 300 14px/24px Noto Sans SC, Montserrat;margin-right: 8px;display: none;}*/
  .icon:hover{transform: scale(1.4);}
</style>
