import { defineComponent, PropType, ref, watch } from 'vue';
import { Image } from 'vant';
import Style from './uploader.module.less';
import { getWXTools } from '@/utils/wxTools';
import { alert } from '@/utils/handleResponse';
import { renderContent, getBaseProps, getEmits } from './global';

export default defineComponent({
  props: {
    ...getBaseProps(),
    upload: {
      type: Function as PropType<(file: any) => Promise<any>>,
      required: true,
    },
    sizeType: {
      type: String,
      defalut: '',
    },
  },
  emits: getEmits(),
  setup(props, { emit }) {
    const status = ref('');
    function chooseFile(file: any) {
      // 重新上传
      if (status.value === 'success') {
        emit('photo', 'uploadAgain');
      } else if (status.value === 'fail') {
        // 重拍
        emit('photo', 'rephotograph');
      }

      status.value = 'uploading';
      emit('photo', 'uploading');
      props
        .upload(file)
        .then((res) => {
          status.value = 'success';
          emit('upload', res);
          emit('photo', 'success');
        })
        .catch((err) => {
          if (err === 'B_KCMS_7101') {
            status.value = 'B_KCMS_7101';
          } else {
            status.value = 'fail';
            emit('photo', 'fail');
          }
        });
    }

    function goPhoto() {
      getWXTools().then((wxTools) => {
        wxTools.chooseImage(
          (res: any) => {
            // TODO
            chooseFile({ image: res });
          },
          (res: any) => {
            alert(res?.errMsg, '知道了', { title: '开启拍照权限' });
          },
          (res: any) => {
            if (res[0]?.errMsg === 'chooseImage:cancel') {
              emit('photo', 'cancel');
            }
          },
          props.sizeType,
        );
      });
    }

    function openPhoto() {
      if (status.value === 'uploading') return;
      setTimeout(() => {
        goPhoto();
      }, 200);

      switch (status.value) {
        case '':
          emit('photo', 'first');
          break;
        case 'uploading':
          break;
        case 'success':
        case 'fail':
          emit('photo', 'redo');
          break;
      }
    }
    watch(
      () => props?.defaultImage,
      (imageValue: any) => {
        // 当有证件信息时status改为success
        if (imageValue.indexOf('base64') > 1) {
          status.value = 'success';
        } else {
          status.value = '';
        }
      },
    );

    return () => (
      // 当有证件信息时status改为success
      // if (props?.defaultImage?.indexOf('base64') > 1 && status.value === '') {
      //   status.value = 'success';
      // }
      <Image
        width={props.width}
        height={props.height}
        radius={props.radius}
        src={props.defaultImage}
        fit="contain"
        class={Style['uploader-image']}
      >
        <div class={`action-box ${status.value ? 'cover' : ''}`} onClick={openPhoto}>
          {renderContent(status.value)}
        </div>
      </Image>
    );
  },
});
