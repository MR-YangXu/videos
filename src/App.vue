<template>
  <router-view />
</template>
<script setup lang="ts">
  const appHeight = () => {
      const doc = document.documentElement
      doc.style.setProperty('--app-height', `${window.innerHeight}px`)
  }
  window.addEventListener('resize', appHeight)
  appHeight()

  // IOS在Iphone X后增加底部导航栏,统一第一次跳转前页面样式
  window.history.replaceState(null, document.title, window.location.href);
</script>

<style>
  :root {
    --app-height: 100%;
  }
  html,
  body {
    min-height: 100%;
    height: var(--app-height);
  }

  #app {
    /* font-family: Avenir, Helvetica, Arial, sans-serif; */
    font-family: PingFang SC;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    background-color: var(--color-bg-1);
    min-height: 100vh;
  }
</style>
