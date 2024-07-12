<template>
  <van-image :width="width" :height="height" :radius="radius" :src="defaultImage" fit="contain" class="uploader-image">
    <div class="action-box" :class="{ cover: status }" @click="openPhoto">
      <van-icon v-if="!status" :name="photoBigSvg" class="uploader-icon" />
      <!--上传中-->
      <van-loading v-else-if="status === 'uploading'" class="loading" type="spinner" color="#ffffff" text-color="#ffffff" vertical
        >上传中</van-loading
      >
      <!--上传成功-->
      <template v-else-if="status === 'success'">
        <van-icon :name="successSvg" class="uploader-icon" />
        <!-- <div class="success">点击重拍</div> -->
      </template>
      <template v-else>
        <div class="title">上传失败</div>
        <div class="button">重新上传</div>
      </template>
    </div>

    <van-action-sheet v-model:show="show" cancel-text="取消" :round="false" close-on-click-action @oversize="onOversize">
      <div class="sheet-content">
        <van-uploader :after-read="chooseFile">
          <van-button block>从手机相册选择</van-button>
        </van-uploader>
      </div>
    </van-action-sheet>
  </van-image>
</template>
<script lang="ts">
  import { defineComponent, PropType, ref } from 'vue';
  import { Image, Loading, Icon, Button, ActionSheet, Uploader,showToast } from 'vant';
  import photoBigSvg from '@/assets/images/photoBig.svg';
  import successSvg from '@/assets/images/success.svg';
  import { getWXTools } from '@/utils/wxTools';
  import { alert } from '@/utils/handleResponse';
  export default defineComponent({
    components: {
      [Image.name]: Image,
      [Loading.name]: Loading,
      [Icon.name]: Icon,
      [ActionSheet.name]: ActionSheet,
      [Button.name]: Button,
      [Uploader.name]: Uploader,
    },
    props: {
      width: {
        type: [Number, String],
      },
      height: {
        type: [Number, String],
      },
      radius: Number,
      defaultImage: String,
      upload: {
        type: Function as PropType<(file: any) => Promise<any>>,
        required: true,
      },
    },
    emits: ['upload', 'photo'],
    setup(props, { emit }) {
      const show = ref(false);
      const status = ref('');
      function chooseFile(file: any) {
        if (import.meta.env.MODE === 'development') {
          file = file.content;
        }
        status.value = 'uploading';
        props
          .upload(file)
          .then((res) => {
            // 重新上传
            if (status.value) {
              emit('photo', 'uploadAgain');
            }
            status.value = 'success';
            emit('upload', res);
          })
          .catch(() => {
            status.value = 'fail';
            emit('photo', 'fail');
          });
      }
      function goPhoto() {
        getWXTools().then((wxTools) => {
          wxTools.chooseImage(
            (res: any) => {
              // TODO
              chooseFile(res);
            },
            (res: any) => {
              alert(res?.errMsg, '知道了', { title: '开启拍照权限' });
            },
            (res: any) => {
              if (res[0]?.errMsg === 'chooseImage:cancel') {
                emit('photo', 'cancel');
              }
            },
          );
        });
      }
      const onOversize = (file: any) => {
        console.log(file);
        showToast('文件大小不能超过 7M');
      };

      return {
        show,
        status,
        openPhoto() {
          if (status.value === 'uploading') return;

          if (__DEV__) {
            show.value = true;
          } else {
            goPhoto();
          }

          switch (status.value) {
            case '':
              emit('photo', 'first');
              break;
            case 'uploading':
              break;
            case 'success':
              break;
            case 'fail':
              emit('photo', 'redo');
              break;
          }
        },
        goPhoto,
        chooseFile,
        onOversize,
        photoBigSvg,
        successSvg,
      };
    },
  });
</script>
<style lang="less" scoped>
  .uploader-image {
    padding: 6px 7px;
    border-radius: 9px;
    border: 1px solid #cecece;
    img {
      height: 74px;
      width: 123px;
      display: block;
    }
    .action-box {
      position: absolute;
      top: 6px;
      right: 7px;
      bottom: 6px;
      left: 7px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      &.cover {
        background: rgba(15, 15, 16, 0.6);
        border-radius: 8px;
        .title {
          font-size: 14px;
          color: #ffffff;
          text-align: center;
        }
        .button {
          width: 85px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 18px;
          border: 1px solid #ffffff;
          font-size: 14px;
          color: #ffffff;
          margin-top: 10px;
          text-align: center;
        }
        .success {
          margin-top: 8px;
          font-size: 14px;
          color: #ffffff;
          text-decoration: underline;
        }
      }
    }

    ::v-deep(.van-loading) {
      width: 40%;
      height: 40%;
      min-width: 52px;
      min-height: 52px;
    }
    ::v-deep(.van-loading__spinner) {
      width: 100%;
      height: 100%;
    }
  }

  .uploader-icon {
    width: 30%;
    height: 30%;
    min-width: 36px;
    min-height: 36px;
    ::v-deep(.van-icon__image) {
      width: 100%;
      height: 100%;
    }
  }
</style>
<style>
  .uploader-image img {
    height: 74px;
    width: 123px;
    display: block;
  }
</style>
