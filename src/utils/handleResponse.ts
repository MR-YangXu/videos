import httpClient from '@/sdk/request';
import { reactive, onUnmounted, nextTick } from 'vue';
import { showLoadingToast, Dialog, DialogOptions, showToast, showDialog } from 'vant';
import { Result, IdPageResult, IdPage } from '@/apis/model/base.model';
import { type } from '@/utils/object';
import { ComponentInstance } from 'vant/lib/utils';
import handleError from '@/sdk/request/handleError';
// import { log } from 'utils/log';

export function handleResponse<T>(result: Result<T> | null): Promise<T | null> {
  if (!result)
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject({
      flag: 'F',
      code: 'net-error',
      msg: 'network error',
    });
  if (result.flag !== 'S') {
    // TODO show error message
    console.error('postHandleResult failed', result.code, result.msg);
    return Promise.reject(result);
  }
  if (!result.data) return Promise.resolve(null);
  return Promise.resolve(result.data);
}

export function link() {}

declare interface LoadingOption<T> {
  timeout?: number;
  message?: string;
  error?: (msg: string) => T;
}
export function handleLoading<T>(request: Promise<T>, options?: undefined | string | number | LoadingOption<T>) {
  switch (type(options)) {
    case 'string':
      options = {
        message: <string>options,
      };
      break;
    case 'number':
      options = {
        timeout: <number>options,
      };
      break;
  }

  const mergedOptions: { message: string; timeout: number; error?: FuncType } = Object.assign(
    {
      message: 'loading...',
      timeout: 60000,
    },
    options,
  );
  let toast = showLoadingToast({
    duration: 0,
    message: mergedOptions?.message,
    forbidClick: true,
    loadingType: 'spinner',
    className: 'loading',
  });

  return new Promise<T>((res, rej) => {
    const tid = setTimeout(() => {
      toast = showToast('请求超时！');
      Promise.resolve(mergedOptions.error ? mergedOptions.error('TIMEOUT') : undefined).finally(rej);
    }, mergedOptions.timeout);

    const closeLoading = () => {
      clearTimeout(tid);
      toast.close();
    };

    request
      .then((rst) => {
        closeLoading();
        res(rst);
      })
      .catch((err) => {
        closeLoading();
        rej(err);
      });
  });
}
export const handleLoadingNew = async <T>(request: Promise<T>, loadingMsg = 'loading…', isShowLoading = true) => {
  let loadingToast;
  const showLoading = () => {
    loadingToast = isShowLoading &&
      showLoadingToast({
        overlay: true,
        duration: 0,
        message: loadingMsg,
        loadingType: 'circular',
        className: 'loading__circular',
        overlayClass: 'loading__overlay',
      });
  };

  const hideLoading = () => {
    if (isShowLoading && loadingToast !== false) {
      loadingToast?.close()
    }
  };

  showLoading();
  try {
    const data = await request;
    hideLoading();
    return data;
  } catch (e) {
    console.error(e);
    hideLoading();
    throw e;
  }
};

export async function handleShowDialog<T>(request: Promise<T>) {
  try {
    const data = await request as any;
    if (data?.flag === 'F') {
       await showDialog({
        message: data?.msg
      })
      return Promise.reject(data);
    }
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export function handlePostResult<T>(service: string, method: string, data: { [key: string]: any } | undefined): Promise<T | null>;
export function handlePostResult<T>(
  loading: boolean,
  service: string,
  method: string,
  data: { [key: string]: any } | undefined,
): Promise<T | null>;
export function handlePostResult<T>(
  options: any,
  service: string,
  method: string,
  data: { [key: string]: any } | undefined,
): Promise<T | null>;
export function handlePostResult<T>(...args: any[]): Promise<T | null> {
  let [options, service, method, data] = args as [any, string, string, { [key: string]: any } | undefined];

  switch (type(options)) {
    case 'string':
      [service, method, data] = args;
      break;
    case 'boolean':
      options = {
        loading: options,
      };
      break;
  }

  if (options.loading) {
    const loadingOptions = {
      message: options.loadingMessage,
      timeout: options.loadingTimeout,
      error:
        options.loadingError ??
        ((error: string) => ({
          flag: 'F',
          msg: error,
        })),
    };

    Object.keys(loadingOptions).forEach((key) => {
      if (loadingOptions[key] === undefined || loadingOptions[key] === null) {
        delete loadingOptions[key];
      }
    });

    return handleLoading(
      httpClient.post<Result<T>>(service, method, data).then((result) => handleResponse<T>(result)),
      loadingOptions,
    );
  }

  return httpClient.post<Result<T>>(service, method, data).then((result) => handleResponse<T>(result));
}

// 数据队列加载，搭配list组件食用
export declare interface DataLoaderResult<T> {
  data?: T[];
  total?: number;
  error?: string;
}
export declare interface DataLoader {
  loading: boolean;
  finished: boolean;
  error: string;
  onLoad: (reload?: boolean) => void;
}
export function getDataLoader<T>(getCurrentDatas: () => T[], api: () => Promise<DataLoaderResult<T>>) {
  const loader = reactive<DataLoader>({
    loading: false,
    finished: false,
    error: '',
    onLoad() {
      api().then((rst) => {
        if (rst?.error) {
          loader.error = rst?.error;
        } else if (rst?.data !== undefined && rst?.total !== undefined) {
          const currentDatas = getCurrentDatas();
          currentDatas.push(...rst.data);
          if (currentDatas.length >= rst.total) {
            loader.finished = true;
          }
        } else {
          console.error('params [data] & [total] are required!');
        }

        loader.loading = false;
      });
    },
  });

  return loader;
}

export function getIdDataLoader<T extends Record<string, any> & { id: string }>(
  api: (page: IdPage) => Promise<Result<IdPageResult<T>> | null>,
  getKey = (item: T) => item.id,
) {
  const loader = reactive<DataLoader & { datas: T[] }>({
    datas: [],
    loading: false,
    finished: false,
    error: '',
    onLoad() {
      const params: IdPage = {
        pageSize: '25',
      };
      const pageNum = loader.datas?.length && getKey(loader.datas[loader.datas.length - 1]);

      if (pageNum) params.pageNum = pageNum;

      api(params).then((rst) => {
        if (rst?.flag !== 'S') {
          loader.error = rst?.msg ?? '分页数据加载错误！';
          console.error('load id datas error', rst);
        } else if (!rst?.data) {
          loader.error = '没有返回有效的分页数据';
        } else {
          const { data } = rst;
          loader.datas.push(...(data.list as any));
          if (data.queryOverFlag === 'Y') {
            loader.finished = true;
          }
        }

        loader.loading = false;
      });
    },
  });

  return loader;
}

export function noticeAlert(message: string, confirmButtonText = '确定', options: DialogOptions) {
  return showDialog(
    Object.assign({
      allowHtml: true,
      messageAlign: 'left',
      width: '315',
      className: 'text-medium msg-dialog msg-dialog-prompt notice-dialog',
      message: `<div class="title">${options.title}</div><div class="message">${message}</div>`,
      confirmButtonText,
      beforeClose: options.beforeClose,
    }),
  );
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function alert(message: string | Function, confirmButtonText = '确定', options?: DialogOptions) {
  return showDialog(
    Object.assign(
      {
        className: 'text-medium msg-dialog msg-dialog-prompt',
        message,
        confirmButtonText,
      },
      options,
    ),
  );
}

/**
 * 关注公众号弹窗
 * @returns
 */
export function pcAlert() {
  return showDialog(
    Object.assign({
      allowHtml: true,
      className: 'msg-dialog msg-dialog-prompt not-wechat-alert',
      message: `<div class="qrcode">
    <div class="image1"></div>
    <p class="message">
     <span>请用微信扫二维码登录“<span class='companyname'>企业金融</span>”公众号</span>
    </p>
    </div>`,
      confirmButtonText: '我知道了',
    }),
  );
}

export function confirm(message: string, cancelButtonText = '取消', confirmButtonText = '确定', options?: DialogOptions) {
  return Dialog.confirm(
    Object.assign(
      {
        className: 'text-medium msg-dialog msg-dialog-prompt',
        message,
        cancelButtonText,
        confirmButtonText,
      },
      options,
    ),
  );
}

export function timeout<T>(cb: Promise<T>, timeout: number) {
  return new Promise<T>((res, rej) => {
    const tid = setTimeout(() => {
      // eslint-disable-next-line prefer-promise-reject-errors
      rej('TIMEOUT');
    }, timeout);

    cb.then((rst) => res(rst))
      .catch((err) => rej(err))
      .then(() => {
        clearTimeout(tid);
      });
  });
}

/**
 * 轮询，请求无终态则继续
 * @param cb 请求
 * @param interval 轮询周期
 * @param timeout 超时时间
 * @returns Promise
 */
export function loop<T>(cb: (resolve: (value?: T) => void, reject: (reason?: any) => void) => void, interval: number, timeout?: number) {
  return new Promise((res, rej) => {
    let tid: NodeJS.Timeout;
    let iid: NodeJS.Timeout;
    if (timeout)
      tid = setTimeout(() => {
        clearTimeout(iid);
        // eslint-disable-next-line prefer-promise-reject-errors
        rej('TIMEOUT');
      }, timeout);

    onUnmounted(() => clearTimeout(iid));

    const _loop = () => {
      new Promise((_res, _rej) => {
        cb(_res, _rej);

        iid = setTimeout(_loop, interval);
      })
        .then((rst) => {
          res(rst);
          clearTimeout(tid);
          clearTimeout(iid);
        })
        .catch((err) => {
          rej(err);
          clearTimeout(tid);
          clearTimeout(iid);
        });
    };

    _loop();
  });
}

/**
 * 轮询，请求无终态则继续
 * @param cb 请求
 * @param interval 轮询周期
 * @param timeout 超时时间
 * @returns Promise
 */
export function newLoop<T>(
  cb: (resolve: (value?: T) => void, reject: (reason?: any) => void, stop?: () => void) => void,
  interval: number,
  timeout?: number,
) {
  return new Promise((res, rej) => {
    let tid: NodeJS.Timeout;
    let iid: NodeJS.Timeout;
    if (timeout)
      tid = setTimeout(() => {
        clearTimeout(iid);
        // eslint-disable-next-line prefer-promise-reject-errors
        rej('TIMEOUT');
      }, timeout);
    function stopTimer() {
      tid && clearTimeout(tid);
      iid && clearTimeout(iid);
    }
    onUnmounted(() => stopTimer());

    const _loop = () => {
      new Promise((_res, _rej) => {
        cb(_res, _rej, stopTimer);
        iid = setTimeout(_loop, interval);
      })
        .then((rst) => {
          res(rst);
          stopTimer();
        })
        .catch((err) => {
          rej(err);
          stopTimer();
        });
    };

    _loop();
  });
}

export function loading(msg: string) {
  return showLoadingToast({
    duration: 0,
    message: msg,
    forbidClick: true,
    loadingType: 'spinner',
    className: 'loading',
  });
}

// 处理请求结果，提供加载、弹窗、toast控制，限制多种提示最多只展示一次，可根据需求添加功能
export class RequestHandler<T> {
  /** 任务队列 */
  private _tasks: FuncType[] = [];

  /** 当前执行任务 */
  private _currentTask: Promise<any> | undefined;

  /** 加载态，避免loading组件多例 */
  private _loading: ComponentInstance | undefined;

  /** 请求结果缓存 */
  private _requestResult: Result<T> | undefined;

  /** 错误是否处理 */
  private _isHandle: boolean | undefined;

  /** 添加任务, 确保每个新增的方法都返回_addTask(() => { *业务逻辑* }) */
  private _addTask(...jobs: FuncType[]) {
    this._tasks.push(...jobs);

    this._runTask();

    return this;
  }

  /** 执行任务 */
  private _runTask(data?: any) {
    if (this._currentTask) return;

    this._currentTask = Promise.resolve(data).then((data) => {
      const _task = this._tasks.shift();
      if (_task) {
        Promise.resolve(_task?.(data)).then((taskResult) => {
          this._currentTask = undefined;
          this._runTask(taskResult);
        });
      } else {
        this._currentTask = undefined;
      }
    });
  }

  /** 打开加载态 */
  public loading(msg = 'loading...', immediate = false) {
    if (immediate) {
      this._loading = loading(msg);
      return this;
    }

    return this._addTask(() => {
      this._loading = loading(msg);
    });
  }

  /** 关闭加载态 */
  public closeLoading() {
    return this._addTask(() => {
      this._loading?.clear();
      this._loading = undefined;
    });
  }

  /** 请求函数 */
  public load(request: Promise<Result<T> | null> | Result<T>, autoLoading = true) {
    if (autoLoading) {
      this.loading('');
    }

    this._addTask(() => {
      this._isHandle = false;

      return Promise.resolve(request)
        .then((data) => {
          if (data === null) {
            console.error('response reuslt is null, please check');
            return this;
          }

          if (data.flag === 'F') {
            const err = handleError(data);
            if (err.isHandle) {
              this._isHandle = true;
            }
          }

          this._requestResult = data;
        })
        .catch((e) => {
          console.error(e);
          this._requestResult = {
            flag: 'F',
            code: 'Network Error',
            msg: '网络异常',
          };
        });
    });

    // 修复toast冲突
    if (autoLoading) {
      this.closeLoading();
    }

    return this;
  }

  public getErrorMessage() {
    if (this._requestResult?.flag !== 'F') return '';
    return this._requestResult?.msg ?? '网络开小差了';
  }

  /** 弹窗错误信息 */
  public alertError(customErrMsg = '没有错误信息') {
    return this._addTask(() => {
      if (this._isHandle !== true && this._requestResult?.flag === 'F') {
        this._isHandle = true;
        console.error(customErrMsg);
        return alert(this.getErrorMessage() ?? customErrMsg);
      }
    });
  }

  /** Toast错误信息 */
  public toastError(customErrMsg = '没有错误信息') {
    return this._addTask(() => {
      if (this._isHandle !== true && this._requestResult?.flag === 'F') {
        this._isHandle = true;
        console.error(customErrMsg);
        nextTick(() => showToast(this.getErrorMessage() ?? customErrMsg));
      }
    });
  }

  /** 处理空data */
  public handleEmptyData(msg = '没有返回数据') {
    return this._addTask(() => {
      if (this._isHandle !== true) {
        this._isHandle = true;
        if (this._requestResult?.data === null) {
          nextTick(() => showToast(msg));
        }
      }
    });
  }

  public handleData(cb: FuncType) {
    return this._addTask(() => {
      cb(this._requestResult);
    });
  }

  /** 终止任务，返回最后一次请求结果 */
  public end() {
    return new Promise<Result<T>>((resolve, reject) => {
      this._addTask(() => {
        if (this._requestResult?.flag === 'S') {
          resolve(this._requestResult);
        } else {
          reject();
        }
      });
    });
  }

  public static handle<T>(request?: Promise<Result<T> | null> | Result<T>, autoLoading = true) {
    const handler = new RequestHandler<T>();

    if (request) {
      handler.load(request, autoLoading);
    }

    return handler;
  }
}
