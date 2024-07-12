import { Ref, watch, ref } from 'vue';

export function shadowData<T>(propData: () => T, changed?: (value: T) => void) {
  const shadow = ref(propData()) as Ref<T>;
  watch(propData, (newVal, oldVal) => {
    if (newVal !== oldVal) {
      shadow.value = newVal;
    }
  });

  watch(shadow, (newVal, oldVal) => {
    if (newVal !== oldVal) {
      changed?.(newVal);
    }
  });

  return shadow;
}
