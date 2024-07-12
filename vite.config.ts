import { UserConfig, ConfigEnv, loadEnv } from 'vite';
import { createVitePlugins } from './build/vite/plugins';
import { fileURLToPath, URL } from 'node:url';
import proxy from './build/vite/proxy';
import { wrapperEnv } from './build/utils';
import path from 'path';
import { terser } from 'rollup-plugin-terser';

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfig => {
  const isBuild = command === 'build';
  // const root = process.cwd();
  const envDir = path.resolve('build', 'env');

  const env = loadEnv(mode, envDir);
  const viteEnv = wrapperEnv(env);
  const base = env.VITE_BASE;
  const assetsDir = env.VITE_ASSET_DIR || 'assets';
  const isDev = env.VITE_DEV === 'Y';
  console.log('viteEnv', viteEnv, 'env', env);
  const entryInput = JSON.parse(env.VITE_PROJECT_ENTRY);

  return {
    base,
    define: {
      __ASSETSDIR__: JSON.stringify(path.posix.join(base, assetsDir, '/')),
      __HOST_ENV__: JSON.stringify(env.VITE_HOST_ENV),
      __DEV__: isDev,
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '#': fileURLToPath(new URL('./types', import.meta.url)),
        apis: fileURLToPath(new URL('./src/apis', import.meta.url)),
        utils: fileURLToPath(new URL('./src/utils', import.meta.url)),
        comps: fileURLToPath(new URL('./src/components', import.meta.url)),
        router: fileURLToPath(new URL('./src/router', import.meta.url)),
        views: fileURLToPath(new URL('./src/views', import.meta.url)),
        store: fileURLToPath(new URL('./src/store', import.meta.url)),
        assets: fileURLToPath(new URL('./src/assets', import.meta.url)),
      },
    },
    // plugins
    plugins: createVitePlugins(viteEnv, isBuild),

    // css
    css: {},

    // server
    server: {
      hmr: { overlay: false }, // 禁用或配置 HMR 连接 设置 server.hmr.overlay 为 false 可以禁用服务器错误遮罩层
      // 服务配置
      port: 8888, // 类型： number 指定服务器端口;
      open: false, // 类型： boolean | string在服务器启动时自动在浏览器中打开应用程序；
      cors: true, // 类型： boolean | CorsOptions 为开发服务器配置 CORS。默认启用并允许任何源
      host: '0.0.0.0', // IP配置，支持从IP启动
      // proxy: {
      //   '/video': {
      //     target: 'http://svedio-api.xunlan-test.com/',
      //     changeOrigin: true,
      //     rewrite:(path) => path.replace(/^\/video/, "")//重写路径,替换/api
      //   },
      // },
    },
    build: {
      assetsDir,
      outDir: `dist/${env.VITE_PROJECT_NAME}`,
      target: 'es2015',
      rollupOptions: {
        input: entryInput,
        output: {
          chunkFileNames: `${assetsDir}/js/[name]-[hash].js`,
          entryFileNames: `${assetsDir}/js/[name]-[hash].js`,
          assetFileNames: `${assetsDir}/[ext]/[name]-[hash].[ext]`,
        },
        plugins: [
          terser({
            compress: {
              // 去除 console.log
              drop_console: true,
            },
          }),
        ],
      },
    },
  };
};
