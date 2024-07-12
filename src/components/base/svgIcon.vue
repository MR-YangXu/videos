<template>
  <svg class="svg-icon" aria-hidden="true" :style="[color ? `color:${color}` : '', size ? `font-size:${size}` : ''].join(' ')">
    <use :xlink:href="`#${name}`"></use>
  </svg>
</template>

<script lang="ts">
import {
  defineComponent,
} from 'vue';
import '@/assets/iconfont/iconfont.js';

export default defineComponent({
  name: 'SvgIcon',
  props: {
    name: {
      type: String,
      required: true
    },
    color: {
      type: String
    },
    size: {
      type: String
    }
  },
});
</script>

<style>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>