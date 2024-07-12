import { onBeforeUpdate, ref, nextTick, watch, onUnmounted } from 'vue';
import { debounce, throttle, appendMethod } from '@/utils/helper';
import { range } from '@/utils/math';

/** 滑动 */
export function useScroll() {
  const protocolDetail = ref();
  let itemRefs: HTMLElement[] = [];
  function getHeight(index: number) {
    return Number(index) >= 0
      ? new Array(index)
          .fill(0)
          .map((_item, idx) => itemRefs[idx]?.offsetHeight + 20)
          .reduce((sum, h) => sum + h, 0)
      : 0;
  }

  // 不更新
  let ignoreListener = false;

  function goto(index: number) {
    const height = getHeight(index);
    if (protocolDetail.value?.scrollTop === height) return;

    ignoreListener = true;
    nextTick(() => {
      protocolDetail.value.scrollTop = height + 1;
    });
  }

  function setProtocolRef(el: any): void {
    if (el) {
      itemRefs.push(el);
    }
  }
  onBeforeUpdate(() => {
    itemRefs = [];
  });

  const isScrolled = ref(false);
  const currentIndex = ref(0);
  const updateIndex = () => {
    let index = 0;
    const height = protocolDetail.value?.scrollTop ?? 0;

    while (height > getHeight(index)) {
      index++;
    }

    currentIndex.value = range(index - 1, 0, itemRefs.length - 1);
  };
  const throttleIndexUpdater = throttle(updateIndex, 100);
  const debounceIndexUpdater = debounce(() => {
    updateIndex();
    ignoreListener = false;
  }, 100);
  
  const scrollListener = appendMethod(
    debounce(() => {
      isScrolled.value = true;
    }, 100),
    () => {
      if (ignoreListener) {
        debounceIndexUpdater();
      } else {
        throttleIndexUpdater();
      }
    },
  );

  watch(protocolDetail, () => {
    protocolDetail.value.addEventListener('scroll', scrollListener);
  });
  onUnmounted(() => {
    if (protocolDetail.value) {
      protocolDetail.value.removeEventListener('scroll', scrollListener);
    }
  });

  return {
    protocolDetail,
    setProtocolRef,
    isScrolled,
    currentIndex,
    toEnd() {
      return new Promise((res) => {
        const height = itemRefs.reduce((sum, h) => sum + h.offsetHeight + 20, 0);
        nextTick(() => {
          protocolDetail.value.scrollTop = height;
          setTimeout(res, 1000);
        });
      });
    },
    goto,
    toPrev() {
      goto(Math.max(currentIndex.value - 1, 0));
    },
    toNext() {
      goto(Math.min(currentIndex.value + 1, itemRefs.length - 1));
    },
  };
}
