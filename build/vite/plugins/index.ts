/**
 * @name createVitePlugins
 * @description 封装plugins数组统一调用
 */
import { PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { ConfigSvgIconsPlugin } from './svgIcons';
import { ConfigMockPlugin } from './mock';
import { ConfigVisualizerConfig } from './visualizer';
import { ConfigCompressPlugin } from './compress';
import { ConfigProgressPlugin } from './progress';
import { ConfigPwaPlugin } from './pwa';
// import { ConfigImageminPlugin } from './imagemin';
// import { ConfigErudaPlugin } from './eruda';

export function createVitePlugins(viteEnv: ViteEnv, isBuild: boolean) {
  const { VITE_MOCK, VITE_USE_COMPRESS, VITE_USER_NODE_ENV } = viteEnv;

  const vitePlugins: (PluginOption | PluginOption[])[] = [
    // vue支持
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => ['wx-open-launch-app', 'wx-open-launch-weapp'].includes(tag),
        },
      },
    }),
    // JSX支持
    vueJsx(),
  ];
  // 构建时显示进度条
  vitePlugins.push(ConfigProgressPlugin());

  // vite-plugin-svg-icons
  vitePlugins.push(ConfigSvgIconsPlugin(isBuild));

  // vite-plugin-mock
  VITE_MOCK === 'Y' && vitePlugins.push(ConfigMockPlugin(isBuild));

  // node_env
  // VITE_USER_NODE_ENV !== 'production' && vitePlugins.push(ConfigErudaPlugin({ debug: true }));

  // rollup-plugin-visualizer
  vitePlugins.push(ConfigVisualizerConfig());

  // pwa
  vitePlugins.push(ConfigPwaPlugin());

  if (isBuild) {
    // vite-plugin-imagemin 图片压缩
    // vitePlugins.push(ConfigImageminPlugin());

    // 开启.gz压缩  rollup-plugin-gzip
    VITE_USE_COMPRESS && vitePlugins.push(ConfigCompressPlugin());
  }

  return vitePlugins;
}
