import { Fragment } from 'vue';
import { Icon, Loading } from 'vant';
import photoBigSvg from '@/assets/images/photoBig.svg';
import successSvg from '@/assets/images/success.svg';

export function renderContent(status: string) {
  switch (status) {
    case '':
      return (
        <Fragment>
          <Icon name={photoBigSvg} class="uploader-icon" />
        </Fragment>
      );
    case 'uploading':
      return (
        <Loading class="loading" type="spinner" color="#ffffff" text-color="#ffffff" vertical>
          上传中
        </Loading>
      );
    case 'success':
      return (
        <Fragment>
          <Icon name={successSvg} class="uploader-icon success" />
          {/* <div class="success">点击重拍</div> */}
        </Fragment>
      );
    case 'B_KCMS_7101': // 人工审核状态
      return (
        <Fragment>
          <div class="title">已提交</div>
          <div class="button">重新上传</div>
        </Fragment>
      );
    default:
      return (
        <Fragment>
          <div class="title">上传失败</div>
          <div class="button">重新上传</div>
        </Fragment>
      );
  }
}

export function getBaseProps() {
  return {
    width: {
      type: [Number, String],
    },
    height: {
      type: [Number, String],
    },
    radius: Number,
    defaultImage: String,
  };
}

export function getEmits() {
  return ['upload', 'photo'];
}
