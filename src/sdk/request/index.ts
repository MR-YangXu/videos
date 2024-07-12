import http from './http';
import { Params, HttpRequest } from './types';
import { ComParams } from './commonParams';
import { showDialog, showToast } from 'vant';
// import { useRouter } from 'vue-router';
// import { closePage } from '@/utils/nativeTools';

// const router = useRouter();
function errorHandler(error: any, method: string) {
  const status = (error?.response?.status as number) + '';
  // if (status === '404') {
  //   router.push({ name: '404' });
  //   return;
  // }
  // 处理500的错误
  if (status.startsWith('5') && !['kpas.user.pinaccess', 'kpas.h5.log.record'].includes(method)) {
    if (status === '504') {
      showToast({ message: 'The network appears to be down, please try again later.' });
    } else {
      showDialog({
        message: 'The network appears to be down, please try again later.',
        confirmButtonText: 'knew',
      });
    }
  }
  console.warn('errorHandle', error, method);
  if (error.toString().indexOf('Network Error') >= 0 && !['kpas.user.pinaccess', 'kpas.h5.log.record'].includes(method)) {
    // showDialog({
    //   message: 'The network seems to be down. Please check whether the network is normal.',
    //   confirmButtonText: 'knew',
    // });
  }
}

class Reqeust {
  private http = http;

  constructor() {
    const url = import.meta.env.VITE_URL as string;
    this.http.init({ baseURL: url });
  }

  public getHttpClient() {
    return this.http;
  }

  private static getCommonParams(): Params {
    // const hostEnv = store.getters.getHostEnv || '';
    return ComParams('WX');
  }

  public get<T>(obj: HttpRequest): Promise<T | null> {
    // const data = Reqeust.getCommonParams();
    // const params = { ...data, ...obj.params };
    // this.replacePathGateWay(obj);
    return this.http.get(obj.path, {});
  }

  public replacePathGateWay(obj: { path: string }) {
    //#if _APP
    obj.path = obj.path.replace('apigateway.do', 'app/apigateway.do');
    //#endif
  }

  public post<T>(obj: HttpRequest): Promise<T | null>;

  public async post<T>(...args: any[]): Promise<T | null> {
    let req: HttpRequest;
    req = args[0];
    // this.replacePathGateWay(req);
    const data = Reqeust.getCommonParams();
    const params = { ...data, ...req.params };

    try {
      console.log(params);
      return await this.http.post(req.path, params);
    } catch (error: any) {
      console.log('error222222', error);
      errorHandler(error, params.method);
      return Promise.reject(error);
    }
  }

  public postFormData<T>(obj: HttpRequest): Promise<T | null>;

  public async postFormData<T>(...args: any[]): Promise<T | null> {
    this.replacePathGateWay(args[0]);
    const { path, params } = args[0];
    const data = Reqeust.getCommonParams();
    const paramData = { ...data, ...params };

    try {
      return await this.http.postFormData(path, paramData);
    } catch (error: any) {
      errorHandler(error, params.method);
      return Promise.reject(error);
    }
  }

  public logsReport(obj: HttpRequest): Promise<void>;

  /**
   * 日志报送入口, 不去补货接口异常
   * @param args
   */
  public async logsReport(...args: any[]): Promise<void> {
    const { path, params } = args[0];
    const data = Reqeust.getCommonParams();
    const paramData = { ...data, ...params };
    try {
      await this.http.logsReport(path, paramData);
    } catch (error: any) {
      return Promise.resolve(error);
    }
  }
}

export default new Reqeust();
