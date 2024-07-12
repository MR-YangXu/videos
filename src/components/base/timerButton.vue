<template>
  <van-button size="small" class="time-btn" type="primary" v-bind="$attrs">
    {{ control.timer ? `${text} ${control.timer}s` : text }}
  </van-button>
</template>

<script lang="ts">
  import { defineComponent, onMounted, reactive, watch } from 'vue';
  import { Button } from 'vant';
  import { createTimer } from '../utils/timer';

  export default defineComponent({
    components: {
      [Button.name]: Button,
    },
    inheritAttrs: false,
    props: {
      text: {
        type: String,
        required: true,
      },
      count: {
        type: Number,
        default: 60,
      },
      autoCount: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['start', 'running', 'end'],
    setup(props, { emit }) {
      const control = reactive({
        timer: 0,
      });

      const timer = createTimer((name, current) => {
        switch (name) {
          case 'change':
            emit('running', (control.timer = current));
            break;
          case 'reset':
            control.timer = current;
            break;
          default:
            emit(name);
            break;
        }
      });

      watch(
        () => props.count,
        (newCount, oldCount) => {
          if (newCount === oldCount) return;
          console.log('watch count changed', newCount);
          timer.set(newCount);
          if (props.autoCount) {
            timer.start();
          }
        },
      );

      watch(
        () => props.autoCount,
        (val) => {
          if (val) {
            timer.start(props.count);
          } else {
            timer.reset();
          }
        },
      );

      onMounted(() => {
        if (props.autoCount) {
          timer.start(props.count);
        }
      });

      return {
        control,
        start() {
          timer.start(...arguments);
        },
        stop() {
          timer.stop();
        },
        reset() {
          timer.reset();
        },
      };
    },
  });
</script>

<style lang="less" scoped>
  .time-btn {
    font-size: 16px;
  }
</style>
