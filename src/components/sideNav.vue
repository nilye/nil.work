<template>
  <div id="side-nav">
    <router-link class="icon" to="/about">
      <i class="material-icons">account_circle</i>
    </router-link>
    <a class="icon" to="mailto:entaroalsace@gmail.com?subject=From Nil.work">
      <i class="material-icons">email</i>
    </a>
  </div>
</template>

<script>
  export default {

  }
</script>

<style lang="scss" scoped>
  #side-nav{display: flex;flex-direction: column;position: absolute;right: 32px;top: 50%;margin-top: -52px;}
  .icon{margin: 12px 0;text-align: right;display: flex;justify-content: flex-end;}
  /*.icon:hover .tool-tip{display: block}*/
  /*.tool-tip{color:#fff;font: 300 14px/24px Noto Sans SC, Montserrat;margin-right: 8px;display: none;}*/
  .material-icons{cursor: pointer;transition: 0.2s ease-in-out;}
  .material-icons:hover{transform: scale(1.4);}
</style>
