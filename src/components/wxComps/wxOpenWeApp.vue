<template>
  <div class="lanch-app">
    <wx-open-launch-weapp
      :style="{ width: `${width}`, height: '44px' }"
      id="launch-btn"
      :username="usename"
      :path="path"
      :env-version="version"
      @launch="onLanch"
      @error="onError"
      @ready="onReady"
    >
      <!--  is="vue:component-name"  -->
      <div is="vue:script" type="text/wxtag-template">
        <div is="vue:style">
          .launchAppBtn { width: 100%; height: 44px; line-height: 44px; font-size: 16px; text-align: center; font-family: PingFangSC-Medium,
          PingFang SC; font-weight: 500; } .launch-default { background: #2C6EFF; color: #FFFFFF; border-radius: 22px; }
        </div>
        <div class="launchAppBtn launch-default">开始刷脸验证</div>
      </div>
    </wx-open-launch-weapp>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  // import WXTools from '@/utils/wxTools';

  import report from '@/utils/report';
  import { eventDetail } from '@/directive/track.event.detail';

  export default defineComponent({
    name: 'WxOpenWeApp',
    props: {
      with: {
        type: String,
        default: '84vw',
      },
      // 给app埋点唤起或者下载的来源
      path: {
        type: String,
        default: '',
      },
      usename: {
        type: String,
        default: '',
      },
      version: {
        type: String,
        default: 'release',
      },
      biztype: {
        type: String,
        default: '',
      },
    },
    setup(props) {
      // const version = ref<'release'|'develop'|'trial'|''>('');
      // const weappPath = ref('');

      const onLanch = (ev: any) => {
        report({
          ...eventDetail[2001],
          customAttributes: {
            bizType: props.biztype,
          },
        });
        if (!ev.isTrusted) {
          report({
            ...eventDetail[2002],
            customAttributes: {
              bizType: props.biztype,
            },
          });
        }
        console.log('onLaunch', ev);

        console.log('onLaunch detail', ev.detail);
      };

      const onError = (err: any) => {
        console.error('onError errMsg', err.errMsg);
      };

      const onReady = (ev: any) => {
        console.log('onReady', ev);
      };

      // new WXTools();

      return {
        width: props.with,
        onLanch,
        onError,
        onReady,
      };
    },
  });
</script>
<style lang="less">
  .lanch-app {
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
  .overlay-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin: 9px 15px 0 0;
    .overlay-block {
      margin-top: 9px;
      // width: 187px;
      height: 22px;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      line-height: 22px;
    }
    .van-icon {
      height: 50px;
      width: 56px;
      &__image {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
