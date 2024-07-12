<template>
  <div class="business-ocr">
    <van-row>
      <van-col :span="24">
        <uploader
          width="160"
          height="222"
          :default-image="buslicPhoto.photoUrl"
          :upload="uploadFront"
          @photo="handleFrontEvent"
          :size-type="'original'"
        />
        <div class="image-text">点击上传营业执照</div>
      </van-col>
    </van-row>
  </div>
</template>
<script lang="ts">
  import { defineComponent, reactive, watch } from 'vue';
  import { Row, Col } from 'vant';
  import { base64toFile } from '@/utils/util';
  import buslic from '@/assets/images/buslic.png';

  import { uploadOCRNew, businessOCRCert } from '@/apis/idcard';
  import { orcDataInputEntiry, businessInfo } from '@/apis/model/idcard.model';
  import Uploader from './uploader';
  import { handleAlert, DefaultErrorMessage, handleErrorOneline } from '@/apis/action/base';
  import { useUserInfoStore } from '@/store/modules/user/index';
  import report from '@/utils/report';
  import { info } from '@/utils/reportTools/logs';
  // import { EPageEnum } from '@/apis/model/LA.model';

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
      businessBase64: String,
    },
    emits: ['dataOcrchange', 'photo', 'redo', 'fail', 'cancel', 'success', 'uploadAgain', 'uploading', 'rephotograph'],
    setup(props, { emit }) {

      console.log('businessLicense--------子组件', props.businessBase64);
      
      // 定义身份证识别的信息
      const formData = reactive<Partial<businessInfo & { applyNo: string; secretBusinessLicenseId: string }>>({
        applyNo: props.applyNo,
      });
      const orcUpload = reactive<orcDataInputEntiry>({
        fileSize: 0,
        fileName: '',
        fileSuffix: '',
        fileContent: '',
        fileType: '',
        file: null,
      });

      const buslicPhoto = reactive({
        photoUrl: buslic,
      });

      watch(
        () => props.businessBase64,
        (newVal) => {
          console.log('businessBase64', newVal,);
          if (newVal) {
            buslicPhoto.photoUrl = newVal;
            console.log('触发更新');
          }
        },
      );

      const userInfo = useUserInfoStore();

      // 文件上传  getBase64Size 新增 S3Field 参数 如果有就不用上传 没有就上传
      const afterRead = async (file: any, fileType: string) => {
        console.log('file', file);
        
        orcUpload.fileType = fileType;
        // 此时可以自行将文件上传至服务器
        // 20221124版本
        // 转成流文件
        orcUpload.fileName = new Date().getTime().toString();
        orcUpload.file = base64toFile(file.image, orcUpload.fileName);
        orcUpload.fileSize = orcUpload.file.size;
        console.log('orcUpload.fileSize', orcUpload.fileSize);

        orcUpload.fileSuffix = 'jpg';
        console.log('orcUpload', orcUpload);
        
        const res = await uploadOCRNew(orcUpload);
        console.log('res', res);
        
        if (res?.flag !== 'S') return handleAlert(res?.msg ?? DefaultErrorMessage ?? 'upload file failed', '信息更新');

        const { s3FileId = '', secretS3FileId = '' } = res.data ?? {};

        info('kcms.user.ocr:upload-bussiness', {
          s3FileId,
          secretS3FileId,
          cardSide: orcUpload.fileType,
          fileSize: orcUpload.fileSize,
        });

        const s3Res = await businessOCRCert({
          s3FileId,
          custNo: userInfo.userNo,
        });
        console.log('s3Res', s3Res);
        
        if (s3Res?.flag === 'F' && s3Res?.code === 'B_KCMS_7101') {
          Object.assign(formData, {
            code: s3Res?.code,
            bisLicenseManualId: s3Res.data?.bisLicenseManualId,
          });
          buslicPhoto.photoUrl = buslic; // 默认图片
          formData.secretBusinessLicenseId = secretS3FileId;
          emit('dataOcrchange', formData);
          return Promise.reject(s3Res?.code);
        }
        if (s3Res?.flag !== 'S') {
          report({
            eventId: '3402',
            eventName: '证件更新',
            eventOperate: '验证失败弹窗',
            customAttributes: s3Res,
          });
          Object.assign(formData, s3Res?.data);
          formData.code = '';
          return handleErrorOneline(s3Res?.msg ?? DefaultErrorMessage ?? 'ocr failed');
        }

        Object.assign(formData, s3Res.data);
        buslicPhoto.photoUrl = file.image;
        formData.code = '';
        formData.secretBusinessLicenseId = secretS3FileId;
        // 回显
        console.log('formData', formData);
        
        emit('dataOcrchange', formData);
        return Promise.resolve();
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
          case 'uploading':
            emit('uploading', fileType);
            break;
          case 'success':
            emit('success', fileType);
            break;
          case 'rephotograph':
            emit('rephotograph', fileType);
            break;
        }
      }

      return {
        buslicPhoto,
        uploadFront(file: any) {
          return afterRead(file, 'BUSLIC');
        },

        handleFrontEvent(type: string) {
          handleEvent('BUSLIC', type);
        },
      };
    },
  });
</script>
<style lang="less" scoped>
  .business-ocr {
    display: flex;
    justify-content: center;
    text-align: center;
    img {
      width: 100% !important;
      height: 100% !important;
    }
    .image-text {
      font-size: 12px;
      color: #4a5888;
      margin-top: 5px;
    }
  }
</style>
<style scoped>
  .business-ocr img {
    width: 100% !important;
    height: 100% !important;
  }
</style>
