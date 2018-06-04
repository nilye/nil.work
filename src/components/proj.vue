<template>
  <div class="proj" v-if="compIsCreated">
    <img class="header-img" :src="images[0]">
    <div v-if="project.showContext" class="header-content">
      <h1>{{project.title}}</h1>
      <div class="snippet">
        <div class="tech-been-used">
          <span>Tools or APIs I used:</span>
          <img v-for="icons of project.tools" :src="'/index/static/img/icons/'+icons+'.png'">
        </div>
        <div class="links" v-if="Object.keys(project.links).length > 0">
          <span>Website & Links</span>
          <a v-for="(links, key) of project.links" target="_blank" :href="links">
            <img :src="'/index/static/img/icons/'+key+'.png'">
          </a>
        </div>
      </div>
      <p>{{project.context}}</p>
    </div>
    <div class="content">
      <img v-for="img in images.slice(1)" :src="img">
    </div>
    <div id="code"></div>
  </div>
</template>

<script>
  import Projects from '../projects'
  export default {
    name:'proj',
    data() {
      return {
        compIsCreated: false,
        id: this.$route.params.id,
        project:null,
        images:null
      }
    },
    watch:{
      '$route'(to, from) {
        this.id = to.params.id
        this.project = Projects.getProject(this.id)
      }
    },
    created: function () {
      this.id = this.$route.params.id
      this.project = Projects.getProject(this.id)
      this.images = Projects.allImages(this.id)
      setTimeout(() => {
        this.compIsCreated = true
      }, 600)
    }
  }
</script>

<style lang="scss" scoped>
  .proj{margin:auto;width:calc( 100vw - 208px );max-width:960px;margin-top:72px;}
  .header-img{width:calc(100vw - 208px);max-width:960px;height: auto; opacity: 0;pointer-events: none;}
  .header-content{margin-bottom: 48px;}
  .header-content h1{font: 700 48px/80px Raleway;}
  .header-content p{font-size: 21px;}
  .snippet{display: flex;}
  .tech-been-used span, .links span{opacity: 0.5;display: block;margin-bottom: 8px;font-size:14px;}
  .tech-been-used img, .links img{height: 32px;margin-right: 16px;}
  .links{margin-left:48px;}
  .content img{width: 100%;margin-top:-8px;}
</style>
