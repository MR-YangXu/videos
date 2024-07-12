import { ref } from 'vue';

let prev = Date.now();
function rafPolyfill(fn: Function) {
  const curr = Date.now();
  const ms = Math.max(0, 16 - (curr - prev));
  const id = setTimeout(fn, ms);
  prev = curr + ms;
  return id;
}

const inBrowser = typeof window !== 'undefined';
const root = inBrowser ? window : global;
const requestAnimationFrame = root.requestAnimationFrame || rafPolyfill;
const cancelAnimationFrame = root.cancelAnimationFrame || root.clearTimeout;

export function raf(fn: FrameRequestCallback) {
  return requestAnimationFrame.call(root, fn);
}
export function cancelRaf(id: number) {
  cancelAnimationFrame.call(root, id);
}

export function createTimer(event: (name: 'start' | 'change' | 'end' | 'reset', e?: any) => void) {
  const counter = ref(0);
  let _count: number;
  let _rid: number;

  function set(count: number) {
    if (isNaN(count)) return console.warn('count should be number', typeof count);
    counter.value = count;
    _count = count;
  }
  function stop() {
    if (_rid) {
      cancelRaf(_rid);
    }
  }

  return {
    set,
    start(count?: undefined | number) {
      if (count) {
        set(count);
      }
      stop();

      if (counter.value <= 0) return;
      const start = Date.now();
      const loop = () => {
        const now = Date.now();
        if (now - start - (_count - counter.value) * 1000 > 1000) {
          counter.value--;
          event('change', counter.value);
        }

        if (counter.value > 0) {
          _rid = raf(loop);
        } else {
          stop();
          event('end');
        }
      };

      event('start');
      event('change', counter.value);
      _rid = raf(loop);
    },
    stop,
    reset() {
      stop();
      event('reset', _count);
      counter.value = _count;
    },
  };
}
