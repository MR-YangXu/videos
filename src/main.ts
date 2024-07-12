import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';
import piniaStore from './store';
import VConsole from 'vconsole';

import './router/permission';
import '@/styles/index.less';
import '@/styles/reset.less';

// 支持SVG
import 'virtual:svg-icons-register';

// 引入vant 样式
import 'vant/lib/index.css';
import { setToastDefaultOptions } from 'vant';

function initPage() {
  const timer = setInterval(function () {
    const before = new Date();
    (function () {}).constructor('debugger')();
    // debugger;
    const after = new Date();
    const cost = after.getTime() - before.getTime();
    if (cost > 100) {
      clearInterval(timer);
      initPage();
    }
  }, 100);
}
process.env.NODE_ENV !== 'development' && initPage();

// // 获取用户代理字符串
// var userAgent = navigator.userAgent;

// // 判断是否为移动端
// var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

// if (!isMobile) {
//     console.log("在桌面端");
//     window.location.href = '/pc';
// }

setToastDefaultOptions({ duration: 3500 });
//vue3的挂载方式
const app = createApp(App);

console.warn(import.meta.env.VITE_ENV, '==============');
if (import.meta.env.VITE_ENV !== 'production') {
  const vConsole = new VConsole();
  app.config.globalProperties.$vConsole = vConsole;
}


app.use(router);
app.use(piniaStore);
app.mount('#app');
