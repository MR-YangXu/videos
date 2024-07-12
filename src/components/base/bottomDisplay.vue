<template>
  <div class="bottom-display" ref="root">
    <slot></slot>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, getCurrentInstance, onUpdated, onMounted, computed, nextTick } from 'vue';

  export default defineComponent({
    props: {
      bottom: [Number, String],
    },
    setup(props) {
      const root = ref();
      const instance = getCurrentInstance();
      const bottom = computed(() => {
        if (props.bottom === undefined) return 0;
        const value = +props.bottom;
        if (isNaN(value)) return 0;
        return value;
      });
      let lastFix = 0;

      function update() {
        nextTick(() => {
          const self = instance?.vnode.el;

          if (self) {
            // self.style.bottom = bottom.value + 'px';
            const rect = self.getBoundingClientRect();
            if (rect && rect.height > 0) {
              let fix = window.innerHeight - (rect.bottom - lastFix) - bottom.value;

              if (fix < 0) fix = 0;

              self.style.transform = `translateY(${((fix / window.innerHeight) * 100).toFixed(5)}vh)`;

              lastFix = fix;
            }
          }
        });
      }

      onMounted(update);
      onUpdated(update);

      return {
        root,
        update,
      };
    },
  });
</script>
