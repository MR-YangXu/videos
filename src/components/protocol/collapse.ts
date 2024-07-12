import { nextTick, ref } from 'vue';

export function useCollapse() {
  const wrapper = ref();
  const content = ref();

  function toggleWidth(expand: boolean) {
    const { offsetWidth = 0 } = content.value || {};

    nextTick(() => {
      if (wrapper.value) {
        wrapper.value.style.width = expand ? '0' : offsetWidth + 'px';
      }
    });
  }

  function toggleHeight(expand: boolean) {
    const { offsetHeight = 0 } = content.value || {};

    nextTick(() => {
      if (wrapper.value) {
        wrapper.value.style.heigth = expand ? '0' : offsetHeight + 'px';
      }
    });
  }

  return {
    wrapper,
    content,
    toggleWidth,
    toggleHeight,
  };
}
