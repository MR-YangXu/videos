<template>
  <popup
    title="阅读并同意协议"
    class="text-left protocol-container"
    v-model:show="show"
    position="bottom"
    :close-on-click-overlay="false"
    @closed="actionClose"
    style="height: 85vh"
  >
    <template #title>
      <span class="text-title text-medium">阅读并同意协议</span>
      <span class="sub-text-title" v-if="(list?.length ?? 0) > 1">（共{{ list?.length }}份）</span>
    </template>
    <div class="protocol-text protocol-summary" v-if="(list?.length ?? 0) > 1">
      <Picker
        :swipe-duration="100"
        :item-height="32"
        :visible-item-count="Math.min((list?.length ?? 1) + 0.5, 5)"
        :modelValue="modelValue"
        :visible-option-num="3"
        :columns="
          list?.map((temp) => ({
            text: temp.templateName,
            value: temp.templateName,
          }))
        "
        @change="selectProtocol"
      />
    </div>
    <div class="protocol-text protocol-detail" ref="protocolDetail"> 
      <template v-for="protocol of list" :key="protocol.templateNo">
        <div
          class="protocol-context"
          :ref="setProtocolRef"
          v-html="protocolContexts[protocol.templateNo ?? '']"
          :style="[list?.length === 1 ? 'border-top: none' : '']"
        ></div>
      </template>
    </div>
    <div class="cover">
      <timer-button
        :text="control.text"
        :auto-count="control.autoCount"
        :count="control.count"
        :disabled="control.disabled"
        v-on="controlEvents"
        round
        block
        class="timerButton"
      />
    </div>
    <div class="controls" v-if="(list?.length ?? 0) > 1">
      <div class="text-right">
        <van-button round plain @click="toNext" class="control-btn">
          <div class="next-btn" @click="nextTwo">
            <div class="next-btn-notify-wrapper" ref="wrapper">
              <div class="next-btn-notify-content" ref="content">下一个</div>
            </div>
            <div class="center">
              <van-icon name="arrow-down" />
            </div>
          </div>
        </van-button>
      </div>
    </div>
  </popup>
</template>

<script lang="ts">
  import { defineComponent, reactive, ref, watch, PropType, nextTick, unref, watchEffect } from 'vue';
  import { useUserInfoStore } from '@/store';
  import { Icon, Button, Row, Col, Picker } from 'vant';
  import TimerButton from 'comps/base/timerButton.vue';
  import Popup from 'comps/base/popup.vue';
  import { ProtocolOutEntity, ProtocolInputEntity } from '@/apis/model/login.model';
  import { downloadHTML, getProtocol } from '@/apis/common';
  import { cache as Cache } from '@/utils/data/cache';
  import { merge, replacer } from '@/utils/object';
  import { shadowData } from '@/components/utils/bind';
  import { useScroll } from './scroll';
  import { useCollapse } from './collapse';
  // import { error, info } from 'utils/log';
  import { info, exceptionLogs as error } from '@/utils/reportTools/logs';
  /**
   * 协议阅读器
   * 如传入protocols，则展示传入参数
   * 否则自动加载协议列表，如列表为空则触发read事件
   */
  export default defineComponent({
    name: 'Viewer',
    components: {
      [Icon.name]: Icon,
      [Button.name]: Button,
      [Row.name]: Row,
      [Col.name]: Col,
      Picker,
      Popup,
      TimerButton,
    },
    props: {
      protocolShow: {
        type: Boolean,
        default: false,
      },
      active: {
        type: Number,
      },
      protocols: {
        type: Array as PropType<ProtocolOutEntity[] | null>,
      },
      flowNode: {
        type: Object as PropType<ProtocolInputEntity>,
      },
      clearCache: {
        type: Boolean,
        default: false,
      },
    },
    emits: [
      'confirm',
      'cancel',
      'update:protocolShow',
      'read',
      'open',
      'close',
      'updateText',
      // 内部加载的协议数据
      'innerdata',
    ], // read: 已阅读
    setup(props, { emit }) {
      const useInfo = useUserInfoStore();
      const show = ref(false);
      // scroll
      const { protocolDetail, setProtocolRef, isScrolled, currentIndex, toEnd, toPrev, toNext, goto } = useScroll();
      //选中协议名称
      const modelValue:any = ref([])

      // 获取具体的协议文本
      const _cache = new Cache((protocol: ProtocolOutEntity) =>
        downloadHTML(
          `${import.meta.env.VITE_STATIC_URL}agreements/${protocol.templateNo ?? ''}_${protocol.templateVersion ?? ''}.html?v=` +
            Date.now(),
        )
          .then((html) => {
            info('agreemnt content loaded', {
              type: 'agreemnt content loaded',
              customAttributes: `${protocol.templateNo ?? ''}_${protocol.templateVersion ?? ''}`,
            });

            return replacer(html, protocol.paramMap ?? {});
          })
          .catch((error) => {
            console.log('error', error);
          }),
      );

      // 协议内容缓存
      const protocolContexts = ref<{ [index: string]: string }>({});
      function loadProtocolContexts(protocol: ProtocolOutEntity) {
        if (protocol.templateNo)
          _cache.invoke(protocol).then((html: string | null | undefined) => {
            if (protocol.templateNo && html) {
              protocolContexts.value[protocol.templateNo] = html;
            }
          });
      }

      // 协议列表，外部传入优先级最高，为空则通过flowNode自行请求加载
      const list = shadowData(
        () => props.protocols,
        () => {
          // eslint-disable-next-line no-use-before-define
          control.count = getReadTime();
        },
      );

      function getReadTime() {
        if (!list.value?.length) return 0;
        return list.value.map((p) => +(p.readTime || '') || 0).sort((a, b) => b - a)[0] || 0;
      }
      const control = reactive({
        text: '我已阅读并同意协议',
        autoCount: true,
        count: getReadTime(),
        disabled: false,
      });

      // 加载协议
      async function loadList() {
        const mergedData = merge(useInfo.flowAgrement, props.flowNode!) as ProtocolInputEntity;
        const data = mergedData.flowType === '9' ? { flowType: '9' } : mergedData;
        list.value = await getProtocol(data);
        info('agreements', {
          type: 'agreements',
          message: 'viewer::load list',
          data: mergedData,
          list: `len: ${list.value?.length}`,
        });
      }

      function showChange(newShow: boolean) {
        if (!newShow) return;

        nextTick(async () => {
          if ((!list.value && props.flowNode) || props.clearCache) {
            try {
              await loadList();
            } catch (e) {
              // 捕获异常
              error('agreements', {
                type: 'agreements',
                message: 'load list fail',
                error: e,
              });
              emit('update:protocolShow', false);
              return;
            }
          }

          info('open list', {
            type: 'open list',
            customAttributes: `${(list.value ?? [])
              .map((protocol) => `${protocol.templateNo ?? ''}_${protocol.templateVersion ?? ''}`)
              .join(', ')}`,
          });

          if (list.value?.length) {
            show.value = newShow;
            control.autoCount = true;
            Promise.all(list.value.map((protocol) => loadProtocolContexts(protocol))).then(() => {
              // TOFIX 在刚show时，滚动失效的梗，尝试移除Timeout
              setTimeout(() => {
                if (props.active && !isScrolled.value) {
                  goto(+props.active);
                }
              }, 50);
            });
          } else {
            emit('read');
            emit('update:protocolShow', false);
          }

          isScrolled.value = false;
          currentIndex.value = 0;
        });
      }

      // 获取模块名称
      function getModelValue(){
        if(list?.value?.length){
          const item = list.value[currentIndex.value]
          console.log(item)
          return [item.templateName]
        }else {
          return []
        }
      }

      // 当props没有传协议队列时，但flowNode发生变化，需要清空本地缓存
      watch(
        () => props.flowNode,
        (newVal, oldVal) => {
          if (newVal && oldVal && !props.protocols && JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
            list.value = null;
            showChange(show.value);
          }
        },
      );
      // 监听阅读位置
      watch(
        () => currentIndex.value,
        () => {
          modelValue.value = getModelValue()
        },
      );

      watchEffect(() => {
        show.value && emit('innerdata', list.value);
      });
      // 下一步按钮事件
      const controlEvents = {
        start() {
          // 计时器开始
          control.text = '阅读协议';
          control.disabled = true;
        },
        end() {
          // 计时器结束
          control.disabled = false;
          control.text = '我已阅读并同意协议';
        },
        click() {
          // 防止重复点击
          if (control.disabled) return;

          control.disabled = true;
          toEnd() // 滚动到最后一行，BUG: IOS不支持smooth
            .then(() => {
              emit('confirm', unref(list));
              show.value = false;

              // 捕获空列表异常
              if (!unref(list)) {
                error('agreements', {
                  type: 'agreements',
                  message: 'viewer::click btn, empty list',
                  list: `len: ${list.value?.length}`,
                });
              }

              // 初始化，准备下次开启弹窗
              setTimeout(() => {
                list.value = props.protocols;
                control.disabled = false;
              }, 1);
            });
        },
      };

      watch(() => props.protocolShow, showChange);

      showChange(props.protocolShow);

      const { wrapper, content, toggleWidth } = useCollapse();

      watch(show, (newVal) => {
        emit('update:protocolShow', newVal);
        if (newVal) {
          emit('open');

          // 下一个协议动画指引，仿制知乎。不用css实现，是由于存在按钮收起方向错误的问题。
          nextTick(() => {
            if (wrapper.value) {
              wrapper.value.style.transitionDuration = '0s';
            }
            toggleWidth(false);

            setTimeout(() => {
              if (!wrapper.value) return;
              wrapper.value.style.transitionDuration = '.3s';
              toggleWidth(true);
            }, 3500);
          });
        } else {
          emit('close');
        }
      });

      return {
        show,
        list,
        protocolContexts,
        control,
        controlEvents,
        nextTwo() {
          emit('updateText', true);
        },
        actionClose() {
          control.autoCount = false;
          emit('cancel');
          emit('update:protocolShow', false);
        },
        setProtocolRef,
        goto,
        protocolDetail,
        currentIndex,
        toEnd,
        toPrev,
        toNext,
        modelValue,
        selectProtocol(_value: any ) {
          goto(_value.selectedIndexes[0]);
        },
        wrapper,
        content,
      };
    },
  });
</script>

<style lang="less" scoped>
  .protocol-container {
    .sub-text-title {
      font-size: 13px;
      color: #bdc5d7;
    }
    .protocol-text {
      font-size: 14px;
      color: #1c1c1c;
    }
    .protocol-summary {
      padding: 0 16px;
      box-shadow: 0px 2px 10px 0px #ced2e5;

      :deep(.van-picker__toolbar) {
        display: none;
      }
      :deep(.van-picker__columns) {
        height: auto;
      }
      :deep(.van-picker-column__item) {
        font-size: 13px;
        color: #81a2ff;
      }
      :deep(.van-picker-column__item--selected) {
        background: #e9edff;
        border-radius: 16px;
      }
    }

    .protocol {
      color: #1c55ff;
      word-break: keep-all;
    }

    .protocol-detail {
      height: 100%;
      scroll-behavior: smooth;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      overflow-x: hidden;
      padding-bottom: 80px;

      .protocol-context {
        position: relative;
        font-size: 13px;
        margin-bottom: 20px;
        padding: 0 24px;
        border-top: 4px solid #dde0f0;

        .page-tag {
          position: absolute;
          right: 22px;
          top: 0;
        }
      }
    }

    .cover {
      background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.3), #ffffff);
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 0px 10px 20px;
    }

    .controls {
      position: absolute;
      right: 8px;
      bottom: 137px;
      z-index: 3;
      max-width: fit-content;
      max-width: -moz-fit-content;

      & > .text-right ~ .text-right {
        margin-top: 12px;
      }
      .control-btn {
        max-width: fit-content;
        max-width: -moz-fit-content;
        box-shadow: 0px 0px 8px rgba(181, 181, 181, 0.5);
      }
    }

    .next-btn {
      overflow: hidden;
      display: flex;
      flex-direction: row;

      .next-btn-notify-wrapper {
        width: 0;
        overflow: hidden;
        transition: width 0.3s ease-in-out;
        will-change: width;
      }

      .next-btn-notify-content {
        padding: 3px;
        white-space: nowrap;
        display: inline-block;
      }
    }
  }

  ::v-global(.protocol-container.popup-box .popup-header) {
    padding: 18px 25px;
    box-shadow: none;
  }
  ::v-global(.protocol-container.popup-box .popup-header .popup-close.popup-close-right) {
    right: 25px;
  }
  ::v-global(.protocol-container .popup-body) {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    border-top: 1px dashed #bdc5d7;
  }
  .timerButton {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 44px;
    line-height: 44px;
    text-align: center;
    border: none;
  }
</style>
