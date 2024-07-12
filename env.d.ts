/// <reference types="vite/client" />

export interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export interface ImportMetaEnv {
  // 项目名字
  VITE_PROJECT_NAME: string;

  // 项目依赖的环境
  VITE_HOST_ENV: string;

  // 域名下的，路径
  VITE_BASE: string;

  // 微信APPID
  VITE_APPID: string;

  // 微信人脸地址
  VITE_FACE_URL: string;

  // email长度
  VITE_EMAIL_LENGTH: string;

  // 系统默认错误
  VITE_DEFAULT_ERROR_MSG: string;

  // 项目访问地址
  VITE_URL: string;

  // 微信关注地址
  VITE_WECHAT_MP_URL: string;

  // 是否本地开发环境
  VITE_DEV: string;

  // 是否开启mock
  VITE_MOCK: string;

  // 是否开启ERUDA
  VITE_ERUDA: string;

  VITE_TEST_AREA: boolean;
  VITE_STATIC_URL: string;

  /**
   * 项目渠道入口文件
   */
  VITE_PROJECT_ENTRY: string;

  /**
   * 资源目录
   */
  VITE_ASSET_DIR: string;
  /**
   * dev 环境下 代理小程序后台 小程序后台没有dev 环境
   */
  VITE_PROXY_ENV: string;
}
