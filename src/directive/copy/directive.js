import { showToast } from 'vant';
import Clipboard from 'clipboard';

const CONTEXT = '@@Copy';

// 绑定事件到元素上
// 读取基本的控制变量
function doBindEvent(context) {
  let clipboard = new Clipboard(context.el, {
    text: function () {
      return context.cb.value;
    },
  });
  clipboard.on('success', () => {
    showToast('复制成功');
  });
  clipboard.on('error', () => {
    showToast('复制失败');
  });

  return clipboard;
}

export default function () {
  return {
    mounted(el, binding, vnode) {
      if (!el[CONTEXT]) {
        el[CONTEXT] = {
          el,
          vm: vnode,
          cb: {},
        };
      }
      el[CONTEXT].cb = binding.value;
      el[CONTEXT].clipboard = doBindEvent(el[CONTEXT]);
    },
    updated(el, binding) {
      el[CONTEXT].cb = binding.value;
    },
    unmounted(el) {
      const context = el[CONTEXT];
      if (context.clipboard) {
        context.clipboard.destroy();
      }
    },
  };
}
