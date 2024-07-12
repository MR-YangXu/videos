import { App } from 'vue';

export default function bind(app: App<Element>) {
  app.directive('longpress', {
    mounted(el, binding) {
      let tid: NodeJS.Timeout;
      const timeout = 500;

      if (typeof binding.value !== 'function') {
        console.warn('binding value shoule be a function, but got ', typeof binding.value);
      }

      function start() {
        tid = setTimeout(() => {
          binding.value();
        }, timeout);
      }

      function end() {
        clearTimeout(tid);
      }

      el.addEventListener('mousedown', start);
      el.addEventListener('touchstart', start);

      el.addEventListener('mouseup', end);
      el.addEventListener('touchend', end);
      el.addEventListener('mouseout', end);
      el.addEventListener('touchcancel', end);

      el.start = start;
      el.end = end;
    },
    updated(el, binding) {
      el.value = binding.value;
    },
    unmounted(el) {
      if (el.start) {
        el.removeEventListener('mousedown', el.start);
        el.removeEventListener('touchstart', el.start);
      }

      if (el.end) {
        el.removeEventListener('mouseup', el.end);
        el.removeEventListener('touchend', el.end);
        el.removeEventListener('mouseout', el.end);
        el.removeEventListener('touchcancel', el.end);
      }
    },
  });
}
