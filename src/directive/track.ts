import { App } from 'vue';
import { reportByEventId } from '@/utils/report';

export default function bind(app: App<Element>) {
  app.directive('track', {
    mounted(el, binding) {
      function cb() {
        reportByEventId(el.value);
      }
      el.addEventListener('click', cb);
      el.cb = cb;
      el.value = binding.value;
    },
    updated(el, binding) {
      el.value = binding.value;
    },
    unmounted(el) {
      if (el.cb) {
        el.removeEventListener('click', el.cb);
      }
    },
  });
  app.directive('tracks', {
    mounted(el, binding) {
      function cb() {
        reportByEventId(el.value);
      }
      el.addEventListener('mousedown', cb);
      el.cb = cb;
      el.value = binding.value;
    },
    updated(el, binding) {
      el.value = binding.value;
    },
    unmounted(el) {
      if (el.cb) {
        el.removeEventListener('mousedown', el.cb);
      }
    },
  });
}
