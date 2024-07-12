<template>
  <van-popover class="popover" :show="true" v-bind="$attrs" trigger="manual" :close-on-click-outside="false">
    <slot></slot>
    <template #reference>
      <slot name="reference"></slot>
    </template>
  </van-popover>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { Popover } from 'vant';

  export default defineComponent({
    name: 'Popover',
    components: {
      [Popover.name]: Popover,
    },
  });
</script>

<style lang="less">
  .popover {
    .van-popover__arrow {
      bottom: 1px !important;
    }
    .van-popover__arrow::before,
    .van-popover__arrow::after {
      content: ' ';
      border: 6px solid transparent;
      position: absolute;
    }

    &.van-popover[data-popper-placement='top'] .van-popover__arrow::before {
      top: -6px;
      left: -6px;
    }
    &.van-popover[data-popper-placement='top'] .van-popover__arrow::after {
      top: -7px;
      left: -6px;
    }

    &.van-popover[data-popper-placement='right'] .van-popover__arrow::before {
      right: -6px;
      top: -6px;
    }
    &.van-popover[data-popper-placement='right'] .van-popover__arrow::after {
      right: -8px;
      top: -6px;
    }

    &.orange .van-popover__content {
      border-radius: 14px !important;
    }
    &.orange .van-popover__content {
      padding: 4px 20px 4px 13px;
    }
    &.orange .van-popover__content {
      border: 1px solid #f99d83;
      background-color: #fff3ef !important;
    }
    &.orange.van-popover[data-popper-placement='top'] .van-popover__arrow {
      border-top-color: #fff3ef !important;
    }
    &.orange.van-popover[data-popper-placement='top'] .van-popover__arrow::before {
      border-top-color: #f99d83;
    }
    &.orange.van-popover[data-popper-placement='top'] .van-popover__arrow::after {
      border-top-color: #fff3ef;
    }

    &.blue .van-popover__content {
      border-radius: 5px !important;
    }
    &.blue .van-popover__content {
      padding: 0 6px 2px 6px;
      border: 1px solid #2f67ff;
    }
    &.blue.van-popover[data-popper-placement^='right'] .van-popover__arrow {
      left: 1px;
    }
    &.blue.van-popover[data-popper-placement='right'] .van-popover__arrow {
      border-right-color: #ffffff !important;
    }
    &.blue.van-popover[data-popper-placement='right'] .van-popover__arrow::before {
      border-right-color: #2f67ff;
    }
    &.blue.van-popover[data-popper-placement='right'] .van-popover__arrow::after {
      border-right-color: #ffffff;
    }
  }
</style>
