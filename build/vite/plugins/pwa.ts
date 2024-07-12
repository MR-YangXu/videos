// 引入自动生成service worker的插件
import { VitePWA } from 'vite-plugin-pwa';

// 配置PWA的相关选项
// const pwaConfig = {
//   strategies: 'generateSW',
//   srcDir: 'src',
//   filename: 'service-worker.js',
//   injectRegister: true,
//   registerType: 'autoUpdate',
//   includeAssets: ['favicon.ico', 'robots.txt', 'sitemap.xml'],
//   manifest: {
//     name: 'Your App Name',
//     short_name: 'Your App',
//     theme_color: '#ffffff',
//     background_color: '#ffffff',
//     display: 'standalone',
//     scope: '/',
//     start_url: '/',
//     icons: [
//       {
//         src: 'path/to/icon.png',
//         sizes: '192x192',
//         type: 'image/png',
//       },
//       // ... 其他图标大小
//     ],
//   },
// };
const pwaConfig = {
  registerType: 'autoUpdate',
  injectRegister: false,

  pwaAssets: {
    disabled: false,
    config: true,
  },

  manifest: false,
  // manifest: {
  //   name: 'realshotr',
  //   short_name: 'realshotr',
  //   description: 'realshotr',
  //   theme_color: '#000000',
  //   background_color: '#000000',
  //   display: 'standalone',
  //   scope: '/',
  //   start_url: '/?c_utm_source=pwa',
  //   icons: [
  //     {
  //       src: 'msapplication-icon-logo.png',
  //       sizes: '144x144',
  //       type: 'image/png',
  //     },
  //     {
  //       src: 'android-chrome-logo.png',
  //       sizes: '192x192',
  //       type: 'image/png',
  //     },
  //     {
  //       src: 'android-chrome-logo.png',
  //       sizes: '256x256',
  //       type: 'image/png',
  //     },
  //     {
  //       src: 'android-chrome-logo.png',
  //       sizes: '384x384',
  //       type: 'image/png',
  //     },
  //     {
  //       src: 'android-chrome-logo.png',
  //       sizes: '512x512',
  //       type: 'image/png',
  //     },
  //   ],
  // },

  workbox: {
    globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
    cleanupOutdatedCaches: true,
    clientsClaim: true,
  },

  devOptions: {
    enabled: false,
    navigateFallback: 'index.html',
    suppressWarnings: true,
    type: 'module',
  },
};

export const ConfigPwaPlugin = () => {
  return VitePWA(pwaConfig);
};
