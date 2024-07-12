<template>
  <div class="logoBox">
      <van-image
        class="logo"
        :src="logo"
      />
    <div class="text">国内首批民营银行之一</div>
  </div>
</template>

<script lang="ts">
  import logo from '@/assets/images/bottomLogo.png';
  import { Image  } from 'vant';
  import { defineComponent } from 'vue';
  export default defineComponent({
    name: 'logo',
    components: {
      [Image.name]: Image,
    },
    setup() {
      return {
        logo
      };
    }
  })
</script>
<style scoped lang="less">
  .logoBox{
    text-align: center;
    width: 100%;
    margin-bottom: 20px;
    margin-top:100px;
    .logo{
      width: 198px;
      height: 17px;
    }
    .text{
      font-size: 12px;
      margin-top:4px;
      color: #666666;
    }
  }
</style>