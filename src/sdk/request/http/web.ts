import HttpClient, { ContentType, Method } from 'axios-mapper';
import { HttpConfig } from '../types';
import { RequestParams } from 'axios-mapper/src/type';
import { handleErrors } from '@/utils/http/handleErrors';
import { showToast } from 'vant';
// import { useUserInfoStore } from '@/store/modules/user';

class WebHttp {
  private httpClient: HttpClient;

  constructor(config?: HttpConfig) {
    this.httpClient = new HttpClient(config);
  }

  public init(config: HttpConfig) {
    this.httpClient = new HttpClient({
      headers: {
        // token: '',
        'uid-token': '',
        'Content-Type': 'application/json;charset=UTF-8',
      },
      withCredentials: true,
      ...config,
    });
  }

  public get<T>(path: string, params: RequestParams): Promise<T | null> {
    const uuid = localStorage.getItem('UUID');
    const lang_id = sessionStorage.getItem('LANGID') || '1';
    const xtoken = import.meta.env.VITE_XTOKEN || sessionStorage.getItem('XTOKEN') || '';
    const access_channel = sessionStorage.getItem("ADVERTIS_OURCE") || '';
    return this.httpClient
      .request(path, Method.GET, params, ContentType.form, { headers: { 'uid-token': uuid || '', 'lang-id': lang_id, 'access-token': xtoken, 'access-channel': access_channel } })
      .then((res: any) => {
        if (['401', '402', '20003'].includes(String(res?.code))) {
          localStorage.setItem('UUID', '');
          showToast('The system is busy, please try again later')
        }
        if (String(res?.code) !== '0') {
          return Promise.reject(res);
        }
        return res;
      })
      .catch((err) => {
        console.log('err', err.toString());
        return Promise.reject(err);
      });
  }

  public post<T>(path: string, params: RequestParams): Promise<T | null> {
    if (import.meta.env.MODE !== 'production') {
      path;
    }
    const uuid = localStorage.getItem('UUID');
    const lang_id = sessionStorage.getItem('LANGID') || '1';
    const xtoken = import.meta.env.VITE_XTOKEN || sessionStorage.getItem('XTOKEN') || '';
    const access_channel = sessionStorage.getItem("ADVERTIS_OURCE") || '';
    return this.httpClient
      .request(path, Method.POST, params, ContentType.json, { headers: { 'uid-token': uuid || '', 'lang-id': lang_id, 'access-token': xtoken, 'access-channel': access_channel } })
      .then((res: any) => {
        if (['401', '402', '20003'].includes(String(res?.code))) {
          localStorage.setItem('UUID', '');
          showToast('The system is busy, please try again later')
        }
        if (String(res?.code) !== '0') {
          return Promise.reject(res);
        }

        return res;
      })
      .catch((err) => {
        console.log('err', err.toString());
        return Promise.reject(err);
      });
  }

  public postFormData<T>(path: string, params: RequestParams): Promise<T | null> {
    const formData = new FormData();
    Object.keys(params || {}).forEach((key: any) => {
      formData.append(key, params[key]);
    });

    return new Promise((resolve, reject) => {
      const url = import.meta.env.VITE_URL + path;
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);
      xhr.upload.onprogress = function (e) {
        console.log('上传进度 ' + Math.round((e.loaded / e.total) * 10000) / 100 + '%');
      };
      xhr.onload = function () {
        if (Math.floor(xhr.status / 100) === 2) {
          console.log('xhr', xhr);
          const reslut = JSON.parse(xhr.response || '{}');
          return resolve(reslut);
        }

        return reject(xhr);
      };
      xhr.onerror = function (e) {
        return reject(e);
      };
      xhr.send(formData);
    })
      .then((res: any) => {
        if (res?.flag === 'F') {
          return handleErrors(res as any)?.then(() => res);
        }
        return res;
      })
      .catch((err) => {
        console.log('err', err.toString());
        return Promise.reject(err);
      });
  }

  /**
   * 日志报送入口, 不去补货接口异常
   * @param path
   * @param params
   * @returns
   */
  public logsReport<T>(path: string, params: RequestParams): Promise<T | null> {
    if (import.meta.env.MODE !== 'production') {
      path;
    }
    const uuid = localStorage.getItem('UUID');
    const lang_id = sessionStorage.getItem('LANGID') || '1';
    const xtoken = import.meta.env.VITE_XTOKEN || sessionStorage.getItem('XTOKEN') || '';
    const access_channel = sessionStorage.getItem("ADVERTIS_OURCE") || '';
    return this.httpClient.request(path, Method.GET, params, ContentType.json, { headers: { 'uid-token': uuid || '', 'lang-id': lang_id, 'access-token': xtoken, 'access-channel': access_channel } });
  }
}

export default new WebHttp();
