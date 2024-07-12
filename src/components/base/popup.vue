<template>
  <van-popup v-model:show="showPopup" @closed="closed" class="popup-box">
    <div class="popup-header">
      <slot name="title">
        <span class="text-title text-medium">{{ title }}</span>
      </slot>
      <div v-if="closeText || $slots.close" class="popup-close" :class="closeClass" @click="showPopup = false">
        <slot name="close">
          {{ closeText }}
        </slot>
      </div>
    </div>
    <div class="popup-body">
      <slot></slot>
    </div>
  </van-popup>
</template>

<script lang="ts">
  import { computed, defineComponent } from 'vue';
  import { Popup, Row, Col } from 'vant';
  import { shadowData } from '../utils/bind';

  export default defineComponent({
    name: 'Popup',
    components: {
      [Popup.name]: Popup,
      [Row.name]: Row,
      [Col.name]: Col,
    },
    props: {
      show: {
        type: Boolean,
      },
      closeText: {
        type: String,
        default: '取消',
      },
      closePosition: {
        type: String,
        default: 'right',
      },
      title: {
        type: String,
      },
    },
    emits: ['update:show', 'close', 'closed'],
    setup: (props, { emit }) => {
      const closeClass = computed(() => {
        const cs: { [key: string]: boolean } = {};
        cs['popup-close-' + props.closePosition] = true;
        return cs;
      });
      const showPopup = shadowData(
        () => props.show,
        (newVal) => {
          emit('update:show', newVal);
          if (!newVal) {
            emit('close');
          }
        },
      );

      return {
        showPopup,
        closeClass,
        closed() {
          emit('closed');
        },
      };
    },
  });
</script>

<style lang="less" scoped>
  .popup-box {
    .popup-header {
      position: relative;
      padding: 10px;
      box-shadow: 0px 1px 0px 0px #dadde5;

      .text-title {
        font-size: 16px;
        color: #1c1c1c;
      }

      .popup-close {
        display: flex;
        align-items: center;
        position: absolute;
        top: 0;
        bottom: 0;
        color: #5e5e5e;

        &.popup-close-left {
          left: 15px;
        }
        &.popup-close-right {
          right: 15px;
        }
      }
    }

    .popup-body {
      flex-grow: 1;
      overflow: auto;
    }
  }

  ::v-global(.popup-box) {
    display: flex;
    flex-direction: column;
  }
</style>
