import { defineComponent, PropType, ref, watch } from 'vue';
import { Image, ActionSheet, Uploader, Button, showToast } from 'vant';
import Style from './uploader.module.less';
import { renderContent, getBaseProps, getEmits } from './global';

export default defineComponent({
  props: {
    ...getBaseProps(),
    upload: {
      type: Function as PropType<(file: any) => Promise<any>>,
      required: true,
    },
  },
  emits: getEmits(),
  setup(props, { emit }) {
    const show = ref(false);
    const status = ref('');
    function chooseFile(file: any) {
      status.value = 'uploading';
      show.value = false;
      props
        .upload({ image: file.content })
        .then((res) => {
          // 重新上传
          if (status.value) {
            emit('photo', 'uploadAgain');
          }
          status.value = 'success';

          emit('upload', res);
        })
        .catch((e) => {
          console.error('upload err', e);
          if (e === 'B_KCMS_7101') {
            status.value = 'B_KCMS_7101';
          } else {
            status.value = 'fail';
            emit('photo', 'fail');
          }
        });
    }

    const onOversize = (file: any) => {
      console.log(file);
      showToast('文件大小不能超过 7M');
    };

    function openPhoto() {
      if (status.value === 'uploading') return;

      show.value = true;

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

        <ActionSheet v-model={[show.value, 'show']} cancel-text="取消" round={false} close-on-click-action>
          <div class="sheet-content">
            <Uploader afterRead={chooseFile} {...{ onOversize }}>
              <Button block>从手机相册选择</Button>
            </Uploader>
          </div>
        </ActionSheet>
      </Image>
    );
  },
});
