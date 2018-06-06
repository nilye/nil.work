<template>
  <a class="back-home" @click="goBack()">
    <i class="material-icons">keyboard_backspace</i>
  </a>
</template>

<script>
  export default {
    name:'backBtn',
    methods:{
      goBack(){
        this.$router.go(-1)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .back-home{position:fixed;left:32px;top:144px;cursor: pointer;}
</style>
