<template>
  <div class="custom-idcard-ocr">
    <van-row>
      <van-col :span="vertical ? 24 : 10">
        <uploader
          :width="vertical ? 175 : 'auto'"
          :height="vertical ? 110 : 'auto'"
          :default-image="frontPhoto.photoUrl"
          :upload="uploadFront"
          @photo="handleFrontEvent"
        />
        <div class="image-text">点击拍摄人像面</div>
      </van-col>
      <van-col :span="vertical ? 24 : 10" :offset="vertical ? 0 : 4" :style="{ 'margin-top': vertical ? '15px' : 0 }">
        <uploader
          :width="vertical ? 175 : 'auto'"
          :height="vertical ? 110 : 'auto'"
          :default-image="backPhoto.photoUrl"
          :upload="uploadBack"
          @photo="handleBackEvent"
        />
        <div class="image-text">点击拍摄国徽面</div>
      </van-col>
    </van-row>
  </div>
</template>
  <script lang="ts">
import { defineComponent, reactive, watch } from 'vue';
import { Row, Col } from 'vant';
import idCardA from '@/assets/images/idCardA.png';
import idCardB from '@/assets/images/idCardB.png';
import { uploadOCR } from '@/apis/idcard';
import { userOcrPure } from '@/apis/common';
import { orcDataInputEntiry, import2InputEntiry } from '@/apis/model/idcard.model';
import Uploader from '@/components/ocr/uploader';
import { handleLoadingNew } from '@/utils/handleResponse';
import { showToast } from 'vant';
import { handleError } from '@/apis/action/base';

export default defineComponent({
  components: {
    [Row.name]: Row,
    [Col.name]: Col,
    Uploader,
  },
  props: {
    vertical: {
      type: Boolean,
      default: true,
    },
    applyNo: {
      type: String,
    },
    frontBase64: String,
    backBase64: String,
  },
  emits: ['dataChange', 'photo', 'redo', 'fail', 'cancel', 'success', 'uploadAgain', 'uploading', 'rephotograph'],
  setup(props, { emit }) {
    // 定义身份证识别的信息
    const formData = reactive<
      import2InputEntiry & {
        secretCertFrontId: string;
        secretCertReverseId: string;
      }
    >({
      applyNo: props.applyNo,
      name: '',
      idNum: '',
      address: '',
      authority: '',
      validDate: '',
      frontS3FileId: '',
      reverseS3FileId: '',
      secretCertFrontId: '',
      secretCertReverseId: '',
    });

    const orcUpload = reactive<orcDataInputEntiry>({
      fileName: '',
      fileSuffix: '',
      fileContent: '',
      fileType: '',
    });
    const frontPhoto = reactive({
      status: 'init',
      photoUrl: idCardA,
      s3FileId: '',
    });
    const backPhoto = reactive({
      status: 'init',
      photoUrl: idCardB,
      s3FileId: '',
    });
    // const frontPhoto = reactive({
    //   photoUrl: idCardA,
    // });
    // const backPhoto = reactive({
    //   photoUrl: idCardB,
    // });

    watch(
      () => props.frontBase64,
      (newVal) => {
        if (newVal) {
          frontPhoto.photoUrl = newVal;
        } else {
          frontPhoto.photoUrl = idCardA;
        }
      },
    );

    watch(
      () => props.backBase64,
      (newVal) => {
        if (newVal) {
          backPhoto.photoUrl = newVal;
        } else {
          backPhoto.photoUrl = idCardB;
        }
      },
    );

    // 文件上传
    const afterRead = async (file: any, type: string) => {
      console.log('file', file);
      // 此时可以自行将文件上传至服务器
      if (type === 'FRONT') {
        frontPhoto.status = 'loading';
      } else {
        backPhoto.status = 'loading';
      }
      orcUpload.fileType = type;
      // // 此时可以自行将文件上传至服务器
      orcUpload.fileContent = file.image;
      orcUpload.fileName = new Date().getTime().toString();
      orcUpload.fileSuffix = 'png';
      emit('uploading', type);
      const res = await handleLoadingNew(uploadOCR(orcUpload), '正在上传…');
      if (res?.flag === 'S') {
        const s3Res = await handleLoadingNew(
          userOcrPure({
            s3FileId: res?.data?.s3FileId || '',
            bizType: 'ACCOUNT_REWRITE',
            cardSide: orcUpload.fileType || '',
          }),
          '正在上传…',
        );
        if (s3Res?.flag === 'S') {
          Object.assign(formData, s3Res?.data);
          const { s3FileId = '', secretS3FileId = '' } = res?.data ?? {};
          const { name = '', idNum = '', address = '', authority = '', validDate = '' } = s3Res?.data ?? {};
          if (orcUpload.fileType === 'FRONT') {
            formData.name = name;
            formData.idNum = idNum;
            formData.address = address;
            formData.frontS3FileId = s3FileId;
            formData.secretCertFrontId = secretS3FileId;
            frontPhoto.photoUrl = file.image;
          } else {
            formData.reverseS3FileId = s3FileId;
            formData.secretCertReverseId = secretS3FileId;
            formData.authority = authority;
            formData.validDate = validDate;
            backPhoto.photoUrl = file.image;
          }
          console.log('formData', formData);
          emit('dataChange', {
            ...formData,
            frontUrl: frontPhoto.photoUrl,
            backUrl: backPhoto.photoUrl,
          });
          return Promise.resolve();
        } else {
          return handleError(s3Res?.msg  ?? '上传失败');
          // if (orcUpload.fileType === 'FRONT') {
          //   frontPhoto.status = 'fail';
          // } else {
          //   backPhoto.status = 'fail';
          // }
          // showToast(s3Res?.msg);
        }
      } else {
        if (orcUpload.fileType === 'FRONT') {
          frontPhoto.status = 'fail';
        } else {
          backPhoto.status = 'fail';
        }
        showToast(res?.msg);
      }
    };

    function handleEvent(fileType: string, eventType: string) {
      switch (eventType) {
        case 'first':
          emit('photo', fileType);
          break;
        case 'redo':
          emit('redo', fileType);
          break;
        case 'fail':
          emit('fail', fileType);
          break;
        case 'cancel':
          emit('cancel', fileType);
          break;
        case 'uploadAgain':
          emit('uploadAgain', fileType);
          break;
        case 'rephotograph':
          emit('rephotograph', fileType);
          break;
        case 'success':
          emit('success', fileType);
      }
    }

    return {
      frontPhoto,
      backPhoto,
      // backPhoto,
      uploadFront(file: any) {
        return afterRead(file, 'FRONT');
      },
      uploadBack(file: any) {
        return afterRead(file, 'BACK');
      },
      handleFrontEvent(type: string) {
        handleEvent('FRONT', type);
      },
      handleBackEvent(type: string) {
        handleEvent('BACK', type);
      },
    };
  },
});
</script>
  <style lang="less" scoped>
.custom-idcard-ocr {
  .image-text {
    font-size: 12px;
    color: #4a5888;
    margin-top: 5px;
  }
}
</style>
  <style>
.custom-idcard-ocr .van-image > img {
  height: 74px !important;
  width: 123px !important;
}
</style>
  