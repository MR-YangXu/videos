import type { VNodeChild, ComponentPublicInstance, FunctionalComponent } from 'vue';

declare global {
  // vue
  declare type VueNode = VNodeChild | JSX.Element;

  export type Writable<T> = {
    -readonly [P in keyof T]: T[P];
  };

  declare type Recordable<T = any> = Record<string, T>;
  declare type ReadonlyRecordable<T = any> = {
    readonly [key: string]: T;
  };
  declare type Indexable<T = any> = {
    [key: string]: T;
  };
  declare type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
  };
  declare type TimeoutHandle = ReturnType<typeof setTimeout>;
  declare type IntervalHandle = ReturnType<typeof setInterval>;

  declare interface ChangeEvent extends Event {
    target: HTMLInputElement;
  }

  declare interface WheelEvent {
    path?: EventTarget[];
  }
  interface ImportMetaEnv extends ViteEnv {
    __: unknown;
  }

  declare interface ViteEnv {
    VITE_OPEN_PROXY?: Boolean;
    VITE_MOCK: 'Y' | 'N';
    VITE_USER_NODE_ENV: string;
    VITE_USE_COMPRESS: Boolean;
  }

  declare function parseInt(s: string | number, radix?: number): number;

  declare function parseFloat(string: string | number): number;

  // 静态资源地址
  declare const __ASSETSDIR__: string;

  // 项目运行的宿主环境
  // APP 和 WX 是构建环境不能修改，可以用if和switch来指定想要的代码
  // H5 是运行时环境标识，构建环境还是WX
  declare const __HOST_ENV__: 'APP' | 'WX' | 'H5';

  // 本地开发环境
  declare const __DEV__: boolean;

  // 版本号
  declare const __APP_VERSION__: string;

  type ObjectKeys<T> =
    // eslint-disable-next-line @typescript-eslint/ban-types
    T extends object ? (keyof T)[] : T extends number ? [] : T extends any[] | string ? string : never;
  interface ObjectConstructor {
    keys<T>(o: T): ObjectKeys<T>;
  }

  type FuncType = (...args: any) => any;

  declare module '*.less' {
    const content: { [className: string]: string };
    export default content;
  }

  declare;
  import.meta;
}

declare module 'vue' {
  export type JSXComponent<Props = any> = { new (): ComponentPublicInstance<Props> } | FunctionalComponent<Props>;
}
